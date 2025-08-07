import React from 'react';
import { Play, Download, Upload, Settings } from 'lucide-react';

interface VideoPreviewProps {
  selectedArticle: any;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ selectedArticle }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Preview</h2>
      
      <div className="space-y-4">
        <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
          {selectedArticle ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-12 h-12 mx-auto mb-4 text-white/70" />
                <p className="text-sm">Video Preview</p>
                <p className="text-xs text-white/70 mt-1">{selectedArticle.title}</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Play className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm">Select an article to preview video</p>
              </div>
            </div>
          )}
        </div>

        {selectedArticle && (
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-gray-900">Title:</p>
              <p className="text-gray-600 mt-1">{selectedArticle.title}</p>
            </div>
            
            <div className="text-sm">
              <p className="font-medium text-gray-900">Summary:</p>
              <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                {selectedArticle.summary}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
              <span>Duration: ~45s</span>
              <span>Resolution: 1080p</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;