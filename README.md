# AutoNews: Autonomous AI News Anchor System

A fully autonomous, AI-powered news generation and publishing system that eliminates the need for human intervention in the news broadcasting pipeline.

## 🚀 Features

- **Real-time News Extraction**: Automatically fetches trending news from NewsAPI
- **AI-Powered Summarization**: Uses Hugging Face BART model for intelligent text summarization
- **Automated Voice Generation**: Converts summaries to speech using TTS services
- **Video Generation**: Creates complete news videos ready for publishing
- **YouTube Integration**: Automatic video publishing to YouTube
- **Web Dashboard**: Modern React interface for monitoring and management
- **Autonomous Operation**: Runs automatically with configurable intervals

## 🛠 Technologies Used

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **RESTful API** architecture
- **Cron Jobs** for automation

### AI/ML Services
- **NewsAPI** for news data
- **Hugging Face Transformers** (BART/T5) for summarization
- **Google Text-to-Speech** for voice generation
- **YouTube Data API** for publishing

### Video Processing
- **MoviePy** (Python) for video generation
- **FFmpeg** for video processing

## 📋 Prerequisites

Before running AutoNews, you'll need to obtain API keys from:

1. **NewsAPI**: Get your free key at [newsapi.org](https://newsapi.org/register)
2. **Hugging Face**: Get your free key at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. **YouTube Data API** (optional): Set up in [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd autonews
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
NEWS_API_KEY=your_newsapi_key_here
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=3001
```

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run dev
```

### 4. Access the Dashboard

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📖 Usage Guide

### Dashboard Overview
The main dashboard provides:
- System status monitoring
- Generation statistics
- Recent activity feed
- Auto-mode toggle for autonomous operation

### News Manager
- Fetch latest news articles
- Search and filter articles
- Preview AI-generated summaries
- Categorize articles automatically

### Video Studio
- Select articles for video generation
- Monitor generation progress
- Preview generated videos
- Upload to YouTube

### Settings
- Configure API keys
- Set automation intervals
- Choose voice models
- Test API connections

## 🔧 API Endpoints

### News Endpoints
- `GET /api/news/fetch` - Fetch latest news
- `GET /api/news/search` - Search articles
- `POST /api/news/summarize` - Generate summary

### Video Endpoints
- `POST /api/video/generate` - Start video generation
- `GET /api/video/status/:jobId` - Check generation status
- `POST /api/video/speech` - Generate speech
- `POST /api/video/upload-youtube` - Upload to YouTube

### Settings Endpoints
- `GET /api/settings` - Get current settings
- `POST /api/settings` - Update settings
- `POST /api/settings/test-apis` - Test API connections

### System Endpoints
- `GET /api/health` - System health check

## 🤖 Automation

AutoNews can run completely autonomously:

1. **Enable Auto Mode** in the dashboard
2. **Set Generation Interval** in settings (default: 6 hours)
3. **Configure Auto-Publishing** to YouTube (optional)

The system will:
- Fetch latest news automatically
- Generate summaries using AI
- Create videos with voice narration
- Publish to YouTube (if enabled)
- Log all activities in the dashboard

## 🔒 Security Notes

- API keys are stored securely and never exposed in responses
- All external API calls are properly authenticated
- Input validation is implemented for all endpoints
- CORS is configured for secure cross-origin requests

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch news"**
   - Check your NewsAPI key in settings
   - Verify API key is valid and has remaining quota

2. **"Summarization failed"**
   - Check your Hugging Face API key
   - Ensure the model is available (may take time to load initially)

3. **"Video generation failed"**
   - Check server logs for detailed error messages
   - Ensure all dependencies are installed

4. **"YouTube upload failed"**
   - YouTube API requires OAuth2 setup for uploads
   - Check YouTube API quotas and permissions

### Debug Mode

Set `NODE_ENV=development` in your `.env` file for detailed logging.

## 📈 Performance

- **News Processing**: ~2-5 seconds per article
- **AI Summarization**: ~3-10 seconds per article
- **Video Generation**: ~30-60 seconds per video
- **YouTube Upload**: ~1-3 minutes per video

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NewsAPI for providing news data
- Hugging Face for AI models
- Google for TTS and YouTube APIs
- The open-source community for various libraries and tools

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Open an issue on GitHub

---

**AutoNews** - Revolutionizing news broadcasting with AI automation 🤖📺