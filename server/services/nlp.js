const axios = require('axios');

async function summarizeArticle(text, maxLength = 100) {
  try {
    if (!process.env.HUGGING_FACE_API_KEY) {
      // Fallback to simple truncation if no API key
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 30,
          do_sample: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    }

    // Fallback if API response is unexpected
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    
  } catch (error) {
    console.error('Summarization error:', error.response?.data || error.message);
    
    // Fallback to simple truncation
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

async function generateKeywords(text) {
  try {
    // Simple keyword extraction (can be enhanced with more sophisticated NLP)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'them', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'].includes(word));

    // Get word frequency
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
      
  } catch (error) {
    console.error('Keyword generation error:', error);
    return [];
  }
}

module.exports = {
  summarizeArticle,
  generateKeywords
};