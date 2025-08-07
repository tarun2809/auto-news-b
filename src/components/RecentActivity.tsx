import React from 'react';
import { Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'Video Generated Successfully',
      description: 'AI breakthrough news video completed',
      time: '2 minutes ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'processing',
      title: 'Processing New Articles',
      description: '5 new articles from NewsAPI',
      time: '5 minutes ago',
      icon: Play
    },
    {
      id: 3,
      type: 'success',
      title: 'Video Published to YouTube',
      description: 'Climate summit coverage uploaded',
      time: '1 hour ago',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'warning',
      title: 'API Rate Limit Warning',
      description: 'Approaching daily quota limit',
      time: '2 hours ago',
      icon: AlertCircle
    }
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className={`p-2 rounded-lg ${getStatusColor(activity.type)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;