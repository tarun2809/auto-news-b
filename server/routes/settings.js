const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

// Get current settings
router.get('/', async (req, res) => {
  try {
    const settings = await loadSettings();
    
    // Don't send API keys in response (security)
    const safeSettings = {
      ...settings,
      newsApiKey: settings.newsApiKey ? '***configured***' : '',
      huggingFaceApiKey: settings.huggingFaceApiKey ? '***configured***' : '',
      youtubeApiKey: settings.youtubeApiKey ? '***configured***' : ''
    };
    
    res.json(safeSettings);
  } catch (error) {
    console.error('Settings load error:', error);
    res.status(500).json({ 
      error: 'Failed to load settings',
      details: error.message
    });
  }
});

// Update settings
router.post('/', async (req, res) => {
  try {
    const currentSettings = await loadSettings();
    const newSettings = { ...currentSettings, ...req.body };
    
    // Validate required fields
    const requiredFields = ['autoGenerationInterval', 'voiceModel', 'videoResolution'];
    for (const field of requiredFields) {
      if (!newSettings[field]) {
        return res.status(400).json({ 
          error: `${field} is required` 
        });
      }
    }

    await saveSettings(newSettings);
    
    // Update environment variables for API keys
    if (newSettings.newsApiKey && newSettings.newsApiKey !== '***configured***') {
      process.env.NEWS_API_KEY = newSettings.newsApiKey;
    }
    if (newSettings.huggingFaceApiKey && newSettings.huggingFaceApiKey !== '***configured***') {
      process.env.HUGGING_FACE_API_KEY = newSettings.huggingFaceApiKey;
    }
    if (newSettings.youtubeApiKey && newSettings.youtubeApiKey !== '***configured***') {
      process.env.YOUTUBE_API_KEY = newSettings.youtubeApiKey;
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ 
      error: 'Failed to save settings',
      details: error.message
    });
  }
});

// Test API connections
router.post('/test-apis', async (req, res) => {
  const results = {};
  
  try {
    // Test NewsAPI
    if (process.env.NEWS_API_KEY) {
      try {
        const axios = require('axios');
        await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us',
            pageSize: 1,
            apiKey: process.env.NEWS_API_KEY
          }
        });
        results.newsApi = { status: 'success', message: 'Connected successfully' };
      } catch (error) {
        results.newsApi = { status: 'error', message: error.response?.data?.message || error.message };
      }
    } else {
      results.newsApi = { status: 'error', message: 'API key not configured' };
    }

    // Test Hugging Face API
    if (process.env.HUGGING_FACE_API_KEY) {
      try {
        const axios = require('axios');
        await axios.post(
          'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
          { inputs: 'Test input for API validation' },
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        results.huggingFace = { status: 'success', message: 'Connected successfully' };
      } catch (error) {
        results.huggingFace = { status: 'error', message: error.response?.data?.error || error.message };
      }
    } else {
      results.huggingFace = { status: 'error', message: 'API key not configured' };
    }

    // Test YouTube API (basic validation)
    if (process.env.YOUTUBE_API_KEY) {
      results.youtube = { status: 'success', message: 'API key configured (upload test requires OAuth)' };
    } else {
      results.youtube = { status: 'error', message: 'API key not configured' };
    }

    res.json(results);
  } catch (error) {
    console.error('API test error:', error);
    res.status(500).json({ 
      error: 'Failed to test APIs',
      details: error.message
    });
  }
});

async function loadSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return default settings if file doesn't exist
    return {
      newsApiKey: process.env.NEWS_API_KEY || '',
      huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY || '',
      youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
      autoGenerationInterval: '6',
      voiceModel: 'en-US-Standard-A',
      videoResolution: '1080p',
      enableNotifications: true,
      autoPublishYoutube: false
    };
  }
}

async function saveSettings(settings) {
  // Ensure data directory exists
  const dataDir = path.dirname(SETTINGS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

module.exports = router;