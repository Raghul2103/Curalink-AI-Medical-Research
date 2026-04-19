import axios from 'axios';

export const fetchOpenAlex = async (query) => {
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=50&page=1&sort=relevance_score:desc`;
    const res = await axios.get(url, { timeout: 10000 });
    const results = res.data.results || [];

    return results.map((work) => {
      const authors = (work.authorships || [])
        .slice(0, 3)
        .map((a) => a.author?.display_name || '')
        .filter(Boolean);

      return {
        title: work.title || 'No title',
        abstract: work.abstract || 'No abstract available',
        authors,
        year: work.publication_year || 'N/A',
        source: 'OpenAlex',
        url: work.doi ? `https://doi.org/${work.doi}` : (work.id || '#'),
      };
    });
  } catch (err) {
    console.error('OpenAlex error:', err.message);
    return [];
  }
};
