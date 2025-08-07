import React from 'react';
import { Eye, Play, Clock, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  article: {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: { name: string };
    category: string;
  };
  onPreview: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onPreview }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <img
            src={article.urlToImage || 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=200'}
            alt={article.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {article.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>{article.source.name}</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={onPreview}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Preview Summary"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                <Play className="w-4 h-4" />
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;