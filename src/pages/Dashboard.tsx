import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  TrendingUp, 
  Video,
  FileText,
  Mic,
  Globe
} from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import SystemStatus from '../components/SystemStatus';

const Dashboard: React.FC = () => {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const stats = [
    {
      label: 'Videos Generated',
      value: '127',
      change: '+12%',
      icon: Video,
      color: 'blue'
    },
    {
      label: 'News Processed',
      value: '1,843',
      change: '+8%',
      icon: FileText,
      color: 'green'
    },
    {
      label: 'Total Runtime',
      value: '24.7h',
      change: '+15%',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Success Rate',
      value: '99.2%',
      change: '+2%',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoMode) {
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoMode]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your autonomous news system</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto Mode</span>
            <button
              onClick={() => setIsAutoMode(!isAutoMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isAutoMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isAutoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Play className="w-4 h-4" />
            <span>Generate Now</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <SystemStatus isAutoMode={isAutoMode} lastUpdate={lastUpdate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;