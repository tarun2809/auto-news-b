import React, { useState } from 'react';
import { FileText, Mic, Video, Download } from 'lucide-react';

interface SummaryPreviewProps {
  article: any;
}

const SummaryPreview: React.FC<SummaryPreviewProps> = ({ article }) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!article) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select an article to preview summary</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'video', label: 'Video', icon: Video }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
      
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'summary' && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {article.summary || article.description}
            </p>
            <div className="text-xs text-gray-400">
              <p>Words: ~{(article.summary || article.description).split(' ').length}</p>
              <p>Estimated reading time: ~{Math.ceil((article.summary || article.description).split(' ').length / 200)} minutes</p>
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Audio will be generated using TTS</p>
              <p className="text-xs text-gray-400 mt-1">Estimated duration: ~45 seconds</p>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Mic className="w-4 h-4" />
              <span>Generate Audio</span>
            </button>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Video preview will appear here</p>
              <p className="text-xs text-gray-400 mt-1">Resolution: 1080p | Duration: ~45s</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Video className="w-4 h-4" />
                <span>Generate</span>
              </button>
              <button className="flex items-center justify-center p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPreview;