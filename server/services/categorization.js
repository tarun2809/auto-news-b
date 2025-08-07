async function categorizeArticle(text) {
  try {
    // Simple keyword-based categorization
    // In production, you might use a more sophisticated ML model
    
    const categories = {
      technology: ['ai', 'artificial intelligence', 'tech', 'software', 'computer', 'digital', 'internet', 'app', 'startup', 'innovation', 'data', 'cyber', 'robot', 'automation'],
      business: ['business', 'economy', 'market', 'stock', 'finance', 'company', 'corporate', 'trade', 'investment', 'revenue', 'profit', 'industry', 'economic'],
      health: ['health', 'medical', 'hospital', 'doctor', 'patient', 'disease', 'treatment', 'medicine', 'healthcare', 'virus', 'vaccine', 'therapy', 'clinical'],
      sports: ['sports', 'football', 'basketball', 'soccer', 'baseball', 'tennis', 'golf', 'olympics', 'championship', 'team', 'player', 'game', 'match'],
      entertainment: ['movie', 'film', 'music', 'celebrity', 'actor', 'actress', 'entertainment', 'hollywood', 'concert', 'album', 'show', 'television', 'tv'],
      politics: ['politics', 'government', 'president', 'election', 'congress', 'senate', 'policy', 'law', 'vote', 'political', 'minister', 'parliament'],
      science: ['science', 'research', 'study', 'scientist', 'discovery', 'experiment', 'laboratory', 'scientific', 'climate', 'space', 'nasa', 'environment']
    };
    
    const lowerText = text.toLowerCase();
    const scores = {};
    
    // Calculate scores for each category
    Object.entries(categories).forEach(([category, keywords]) => {
      scores[category] = keywords.reduce((score, keyword) => {
        const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
        return score + matches;
      }, 0);
    });
    
    // Find category with highest score
    const bestCategory = Object.entries(scores).reduce((best, [category, score]) => {
      return score > best.score ? { category, score } : best;
    }, { category: 'general', score: 0 });
    
    return bestCategory.score > 0 ? bestCategory.category : 'general';
    
  } catch (error) {
    console.error('Categorization error:', error);
    return 'general';
  }
}

module.exports = {
  categorizeArticle
};