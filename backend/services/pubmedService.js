import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const flattenText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join(' ');
  
  if (typeof node === 'object') {
    let parts = [];
    if (node['#text']) parts.push(String(node['#text']));
    
    Object.keys(node).forEach(key => {
      if (key !== '#text' && key !== ':@') {
        const val = flattenText(node[key]);
        if (val) parts.push(val);
      }
    });
    return parts.join(' ').trim().replace(/\s+/g, ' ');
  }
  return '';
};

export const fetchPubMed = async (query) => {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=50&sort=pub+date&retmode=json`;
    const searchRes = await axios.get(searchUrl, { timeout: 10000 });
    const ids = searchRes.data.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`;
    const fetchRes = await axios.get(fetchUrl, { timeout: 15000 });

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(fetchRes.data);

    const articles = parsed?.PubmedArticleSet?.PubmedArticle;
    if (!articles) return [];

    const list = Array.isArray(articles) ? articles : [articles];

    return list.map((article) => {
      const medline = article.MedlineCitation;
      const info = medline?.Article;
      const pmid = medline?.PMID?.['#text'] || medline?.PMID;

      const authorList = info?.AuthorList?.Author;
      let authors = [];
      if (authorList) {
        const arr = Array.isArray(authorList) ? authorList : [authorList];
        authors = arr.slice(0, 3).map((a) => `${a.LastName || ''} ${a.ForeName || ''}`.trim());
      }

      // Safe flattening for title and abstract
      const title = flattenText(info?.ArticleTitle) || 'No title';
      
      let abstract = 'No abstract available';
      const abstractNode = info?.Abstract?.AbstractText;
      if (abstractNode) {
        abstract = flattenText(abstractNode);
      }

      return {
        title,
        abstract: abstract.slice(0, 500) + (abstract.length > 500 ? '...' : ''),
        authors,
        year: info?.Journal?.JournalIssue?.PubDate?.Year || 'N/A',
        source: 'PubMed',
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      };
    });
  } catch (err) {
    console.error('PubMed error:', err.message);
    return [];
  }
};
