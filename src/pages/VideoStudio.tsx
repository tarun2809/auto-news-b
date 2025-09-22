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

const VideoStudio: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [generationStage, setGenerationStage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const stages = [
    { name: 'Summarizing', icon: FileText, description: 'AI is processing the news article' },
    { name: 'Voice Generation', icon: Mic, description: 'Converting text to speech' },
    { name: 'Video Assembly', icon: Video, description: 'Creating final video' },
    { name: 'Complete', icon: Play, description: 'Video ready for preview' }
  ];

  const mockArticles = [
    {
      id: 1,
      title: 'Major Breakthrough in AI Technology Announced',
      summary: 'A revolutionary AI system has been developed that can process natural language with unprecedented accuracy...',
      category: 'Technology',
      publishedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders unite on comprehensive climate action plan targeting net-zero emissions by 2050...',
      category: 'Environment',
      publishedAt: '2024-01-15T08:15:00Z'
    }
  ];

  const handleGenerateVideo = async () => {
    setGenerationStage('Summarizing');
    setProgress(0);

    for (let i = 0; i < stages.length; i++) {
      setGenerationStage(stages[i].name);
      
      // Simulate progress
      for (let j = 0; j <= 100; j += 10) {
        setProgress((i * 100 + j) / stages.length);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    setGenerationStage(null);
    setProgress(0);
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
              {mockArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedArticle?.id === article.id
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