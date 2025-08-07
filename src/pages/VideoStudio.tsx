import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Upload, 
  Settings as SettingsIcon,
  Mic,
  Video,
  FileText,
  Clock
} from 'lucide-react';
import VideoPreview from '../components/VideoPreview';
import GenerationProgress from '../components/GenerationProgress';
import { apiService } from '../services/api';
import { useNews } from '../context/NewsContext';

const VideoStudio: React.FC = () => {
  const { articles } = useNews();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [generationStage, setGenerationStage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const stages = [
    { name: 'Summarizing', icon: FileText, description: 'AI is processing the news article' },
    { name: 'Voice Generation', icon: Mic, description: 'Converting text to speech' },
    { name: 'Video Assembly', icon: Video, description: 'Creating final video' },
    { name: 'Complete', icon: Play, description: 'Video ready for preview' }
  ];


  const handleGenerateVideo = async () => {
    if (!selectedArticle) return;

    try {
      const response = await apiService.generateVideo(selectedArticle);
      setCurrentJobId(response.jobId);
      setGenerationStage('Summarizing');
      setProgress(0);

      // Poll for status updates
      pollVideoStatus(response.jobId);
    } catch (error) {
      console.error('Failed to start video generation:', error);
      alert('Failed to start video generation. Please try again.');
    }
  };

  const pollVideoStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await apiService.getVideoStatus(jobId);
        
        setGenerationStage(status.stage);
        setProgress(status.progress);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
          setCurrentJobId(null);
          
          if (status.status === 'failed') {
            alert('Video generation failed: ' + status.error);
          }
          
          setGenerationStage(null);
          setProgress(0);
        }
      } catch (error) {
        console.error('Failed to get video status:', error);
        clearInterval(pollInterval);
        setCurrentJobId(null);
        setGenerationStage(null);
        setProgress(0);
      }
    }, 2000);
  };

  // Use real articles from context
  const availableArticles = articles.slice(0, 10); // Show first 10 articles

  if (availableArticles.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Studio</h1>
          <p className="text-gray-600">No articles available. Please fetch news articles first from the News Manager.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Studio</h1>
          <p className="text-gray-600 mt-1">Create and manage AI-generated news videos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Article</h2>
            <div className="space-y-3">
              {availableArticles.map((article, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedArticle(article as any)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedArticle?.title === article.title
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{article.category}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(article.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {generationStage && (
            <GenerationProgress 
              currentStage={generationStage}
              progress={progress}
              stages={stages}
            />
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Video Controls</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleGenerateVideo}
                disabled={!selectedArticle || generationStage !== null}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                <span>Generate Video</span>
              </button>
              
              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                  <span>Upload to YouTube</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <VideoPreview selectedArticle={selectedArticle} />
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;