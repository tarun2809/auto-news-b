const express = require('express');
const axios = require('axios');
const { summarizeArticle } = require('../services/nlp');
const { categorizeArticle } = require('../services/categorization');

const router = express.Router();

// Fetch latest news
router.get('/fetch', async (req, res) => {
  try {
    const { category = 'general', country = 'us', pageSize = 20 } = req.query;
    
    if (!process.env.NEWS_API_KEY) {
      return res.status(400).json({ 
        error: 'NewsAPI key not configured. Please add NEWS_API_KEY to your environment variables.' 
      });
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country,
        category: category === 'all' ? undefined : category,
        pageSize,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = await Promise.all(
      response.data.articles
        .filter(article => article.title && article.description && article.urlToImage)
        .map(async (article) => {
          try {
            const summary = await summarizeArticle(article.description);
            const detectedCategory = await categorizeArticle(article.title + ' ' + article.description);
            
            return {
              ...article,
              summary,
              category: detectedCategory || category,
              id: generateArticleId(article.url)
            };
          } catch (error) {
            console.error('Error processing article:', error);
            return {
              ...article,
              summary: article.description,
              category: category,
              id: generateArticleId(article.url)
            };
          }
        })
    );

    res.json({ articles, total: articles.length });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error.response?.data?.message || error.message
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