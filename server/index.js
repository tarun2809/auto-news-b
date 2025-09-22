const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
let newsRoutes, videoRoutes, settingsRoutes;

try {
  newsRoutes = require('./routes/news');
  videoRoutes = require('./routes/video');
  settingsRoutes = require('./routes/settings');
} catch (error) {
  console.error('Error loading routes:', error.message);
  process.exit(1);
}
const { initializeServices } = require('./services/initialization');
// Load environment variables with error handling
try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv not found, using environment variables');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    services: {
      newsApi: !!process.env.NEWS_API_KEY,
      huggingFace: !!process.env.HUGGING_FACE_API_KEY,
      youtube: !!process.env.YOUTUBE_API_KEY
    }
    version: '1.0.0',
    port: PORT
  });
});

// Auto-generation cron job (every 6 hours by default)
cron.schedule('0 */6 * * *', async () => {
  console.log('Running automated news generation...');
  try {
    const { generateAutomaticVideo } = require('./services/automation');
    await generateAutomaticVideo();
  } catch (error) {
    console.error('Automated generation failed:', error);
  }
});

// Initialize services
initializeServices();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AutoNews server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;