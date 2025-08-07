const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const newsRoutes = require('./routes/news');
const videoRoutes = require('./routes/video');
const settingsRoutes = require('./routes/settings');
const { initializeServices } = require('./services/initialization');

dotenv.config();

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

app.listen(PORT, () => {
  console.log(`AutoNews server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;