const express = require('express');
const router = express.Router();

// Import services with error handling
let nlpService, categorization;
try {
  nlpService = require('../services/nlp');
  categorization = require('../services/categorization');
} catch (error) {
  console.warn('Some services not available:', error.message);
}

// Fetch news from NewsAPI
router.get('/fetch', async (req, res) => {
  try {
    const { category = 'general', country = 'us', pageSize = 20 } = req.query;
    
    // Check if NEWS_API_KEY is available
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({ 
        error: 'NEWS_API_KEY not configured',
        articles: []
      });
    }

    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add categories to articles
    const articlesWithCategories = (data.articles || []).map(article => ({
      ...article,
      category: categorization ? categorization.categorizeArticle(article) : 'general'
    }));
    
    res.json({
      articles: articlesWithCategories,
      totalResults: data.totalResults
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error.message,
      articles: []
    });
  }
});

// Get article summary
router.post('/summarize', async (req, res) => {
  try {
    const { text, maxLength = 100 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await summarizeArticle(text, maxLength);
    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message
    });
  }
});

// Search articles
router.get('/search', async (req, res) => {
  try {
    const { q, sortBy = 'publishedAt', pageSize = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!process.env.NEWS_API_KEY) {
      return res.status(400).json({ 
        error: 'NewsAPI key not configured' 
      });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q,
        sortBy,
        pageSize,
        language: 'en',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = response.data.articles.map(article => ({
      ...article,
      id: generateArticleId(article.url),
      category: 'general'
    }));

    res.json({ articles, total: articles.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      details: error.response?.data?.message || error.message
    });
  }
});

function generateArticleId(url) {
  return Buffer.from(url).toString('base64').slice(0, 16);
}

module.exports = router;