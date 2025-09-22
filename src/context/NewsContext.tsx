import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
  summary?: string;
}

interface NewsContextType {
  articles: Article[];
  loading: boolean;
  fetchArticles: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);


  const fetchArticles = async () => {
    setLoading(true);

    try {
      const response = await apiService.fetchNews({ pageSize: 20 });
      setArticles(response.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Fallback to empty array or show error message
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <NewsContext.Provider value={{ articles, loading, fetchArticles }}>
      {children}
    </NewsContext.Provider>
  );
};