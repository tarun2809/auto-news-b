const fs = require('fs').promises;
const path = require('path');

async function initializeServices() {
  try {
    console.log('Initializing AutoNews services...');
    
    // Create necessary directories
    const directories = [
      path.join(__dirname, '../data'),
      path.join(__dirname, '../temp'),
      path.join(__dirname, '../output'),
      path.join(__dirname, '../public')
    ];
    
    for (const dir of directories) {
      try {
        await fs.access(dir);
        console.log(`Directory exists: ${dir}`);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }
    
    // Check environment variables
    const requiredEnvVars = ['NEWS_API_KEY', 'HUGGING_FACE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('Missing environment variables:', missingVars.join(', '));
      console.warn('Some features may not work properly. Please configure these in your .env file.');
    }
    
    // Initialize default settings if they don't exist
    const settingsPath = path.join(__dirname, '../data/settings.json');
    try {
      await fs.access(settingsPath);
      console.log('Settings file exists');
    } catch {
      const defaultSettings = {
        newsApiKey: process.env.NEWS_API_KEY || '',
        huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY || '',
        youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
        autoGenerationInterval: '6',
        voiceModel: 'en-US-Standard-A',
        videoResolution: '1080p',
        enableNotifications: true,
        autoPublishYoutube: false
      };
      
      await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
      console.log('Created default settings file');
    }
    
    console.log('AutoNews services initialized successfully');
    
  } catch (error) {
    console.error('Service initialization failed:', error);
    throw error;
  }
}

module.exports = {
  initializeServices
};