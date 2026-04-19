export const rankResults = (results, query, topN = 8) => {
  const queryWords = query.toLowerCase().split(' ').filter((w) => w.length > 3);
  const currentYear = new Date().getFullYear();

  const scored = results.map((r) => {
    let score = 0;
    
    // Safely parse title and abstract to strings, as PubMed XML often returns objects for titles with italics markup
    const safeTitle = typeof r.title === 'string' ? r.title : JSON.stringify(r.title || '');
    const safeAbstract = typeof r.abstract === 'string' ? r.abstract : JSON.stringify(r.abstract || '');
    
    const text = `${safeTitle} ${safeAbstract}`.toLowerCase();

    queryWords.forEach((word) => {
      if (text.includes(word)) score += 2;
      if (safeTitle.toLowerCase().includes(word)) score += 3;
    });

    const year = parseInt(r.year);
    if (!isNaN(year)) score += Math.max(0, 10 - (currentYear - year));

    return { ...r, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topN);
};
