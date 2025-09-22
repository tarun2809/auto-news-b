const express = require('express');
const { generateVideo } = require('../services/videoGeneration');
const { generateSpeech } = require('../services/tts');
const { uploadToYoutube } = require('../services/youtube');

const router = express.Router();

// Generate video from article
router.post('/generate', async (req, res) => {
  try {
    const { article, options = {} } = req.body;
    
    if (!article || !article.title || !article.summary) {
      return res.status(400).json({ 
        error: 'Article with title and summary is required' 
      });
    }

    // Start video generation process
    const jobId = generateJobId();
    
    // Send immediate response with job ID
    res.json({ 
      jobId, 
      status: 'started',
      message: 'Video generation started'
    });

    // Process video generation asynchronously
    processVideoGeneration(jobId, article, options);
    
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ 
      error: 'Failed to start video generation',
      details: error.message
    });
  }
});

// Get video generation status
router.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const status = getJobStatus(jobId);
  
  if (!status) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json(status);
});

// Generate speech from text
router.post('/speech', async (req, res) => {
  try {
    const { text, voice = 'en-US-Standard-A' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioBuffer = await generateSpeech(text, voice);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('Speech generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message
    });
  }
});

// Upload video to YouTube
router.post('/upload-youtube', async (req, res) => {
  try {
    const { videoPath, title, description, tags = [] } = req.body;
    
    if (!videoPath || !title) {
      return res.status(400).json({ 
        error: 'Video path and title are required' 
      });
    }

    const result = await uploadToYoutube({
      videoPath,
      title,
      description,
      tags
    });

    res.json(result);
  } catch (error) {
    console.error('YouTube upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload to YouTube',
      details: error.message
    });
  }
});

// Job management
const jobs = new Map();

function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getJobStatus(jobId) {
  return jobs.get(jobId);
}

async function processVideoGeneration(jobId, article, options) {
  try {
    // Update job status
    jobs.set(jobId, {
      id: jobId,
      status: 'processing',
      stage: 'summarizing',
      progress: 0,
      startTime: new Date()
    });

    // Stage 1: Text processing
    jobs.set(jobId, { ...jobs.get(jobId), stage: 'summarizing', progress: 25 });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

    // Stage 2: Speech generation
    jobs.set(jobId, { ...jobs.get(jobId), stage: 'voice_generation', progress: 50 });
    const audioBuffer = await generateSpeech(article.summary, options.voice);
    
    // Stage 3: Video assembly
    jobs.set(jobId, { ...jobs.get(jobId), stage: 'video_assembly', progress: 75 });
    const videoPath = await generateVideo({
      title: article.title,
      summary: article.summary,
      audioBuffer,
      image: article.urlToImage,
      options
    });

    // Stage 4: Complete
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'completed',
      stage: 'complete',
      progress: 100,
      videoPath,
      endTime: new Date()
    });

  } catch (error) {
    console.error('Video generation failed:', error);
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'failed',
      error: error.message,
      endTime: new Date()
    });
  }
}

module.exports = router;