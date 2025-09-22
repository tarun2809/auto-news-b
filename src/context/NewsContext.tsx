import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const mockArticles: Article[] = [
    {
      title: "Revolutionary AI System Achieves Human-Level Performance in Complex Reasoning",
      description: "A breakthrough in artificial intelligence has been achieved with a new system that demonstrates human-level performance in complex reasoning tasks, marking a significant milestone in AI development.",
      url: "https://example.com/ai-breakthrough",
      urlToImage: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: "2024-01-15T10:30:00Z",
      source: { name: "Tech News Daily" },
      category: "technology",
      summary: "Scientists have developed an AI system that matches human performance in complex reasoning tasks, representing a major advancement in artificial intelligence capabilities."
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
      description: "World leaders at the climate summit have reached a unprecedented agreement on carbon reduction targets, with binding commitments from major economies to achieve net-zero emissions by 2050.",
      url: "https://example.com/climate-agreement",
      urlToImage: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: "2024-01-15T08:15:00Z",
      source: { name: "Environmental Report" },
      category: "environment",
      summary: "A historic climate agreement has been reached with binding commitments from world leaders to achieve net-zero carbon emissions by 2050."
    },
    {
      title: "Major Breakthrough in Quantum Computing Announced by Tech Giants",
      description: "Leading technology companies have announced a significant breakthrough in quantum computing, with new processors achieving quantum supremacy in practical applications.",
      url: "https://example.com/quantum-computing",
      urlToImage: "https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: "2024-01-15T06:45:00Z",
      source: { name: "Quantum Today" },
      category: "technology",
      summary: "Tech companies have achieved quantum supremacy with new processors that demonstrate practical applications for quantum computing."
    },
    {
      title: "Healthcare Innovation: Gene Therapy Shows Promise in Clinical Trials",
      description: "New gene therapy treatments have shown remarkable results in clinical trials, offering hope for patients with previously incurable genetic diseases.",
      url: "https://example.com/gene-therapy",
      urlToImage: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: "2024-01-14T16:20:00Z",
      source: { name: "Medical Journal" },
      category: "health",
      summary: "Revolutionary gene therapy treatments are showing promising results in clinical trials for genetic diseases."
    },
    {
      title: "Economic Markets Surge Following Federal Reserve Policy Changes",
      description: "Global financial markets have experienced significant gains after the Federal Reserve announced new monetary policy measures designed to stimulate economic growth.",
      url: "https://example.com/market-surge",
      urlToImage: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800",
      publishedAt: "2024-01-14T14:30:00Z",
      source: { name: "Financial Times" },
      category: "business",
      summary: "Financial markets are surging following the Federal Reserve's announcement of new monetary policy measures to boost economic growth."
    }
  ];

  const fetchArticles = async () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
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