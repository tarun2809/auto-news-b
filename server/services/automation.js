const axios = require('axios');
const { generateVideo } = require('./videoGeneration');
const { generateSpeech } = require('./tts');
const { uploadToYoutube } = require('./youtube');

async function generateAutomaticVideo() {
  try {
    console.log('Starting automatic video generation...');
    
    // Fetch latest news
    const newsResponse = await axios.get('http://localhost:3001/api/news/fetch?pageSize=1');
    const articles = newsResponse.data.articles;
    
    if (!articles || articles.length === 0) {
      console.log('No articles found for automatic generation');
      return;
    }
    
    const article = articles[0];
    console.log(`Processing article: ${article.title}`);
    
    // Generate speech
    const audioResult = await generateSpeech(article.summary);
    
    // Generate video
    const videoResult = await generateVideo({
      title: article.title,
      summary: article.summary,
      audioBuffer: audioResult.buffer,
      image: article.urlToImage
    });
    
    console.log(`Video generated: ${videoResult.videoPath}`);
    
    // Check if auto-publish is enabled
    const settingsResponse = await axios.get('http://localhost:3001/api/settings');
    const settings = settingsResponse.data;
    
    if (settings.autoPublishYoutube) {
      console.log('Auto-publishing to YouTube...');
      
      const uploadResult = await uploadToYoutube({
        videoPath: videoResult.videoPath,
        title: article.title,
        description: `${article.summary}\n\nSource: ${article.source.name}\nGenerated automatically by AutoNews AI`,
        tags: ['news', 'ai', 'automated', article.category]
      });
      
      console.log(`Published to YouTube: ${uploadResult.url}`);
    }
    
    return {
      article,
      video: videoResult,
      published: settings.autoPublishYoutube
    };
    
  } catch (error) {
    console.error('Automatic generation failed:', error);
    throw error;
  }
}

module.exports = {
  generateAutomaticVideo
};