import React from 'react';
import { Activity, Server, Database, Wifi } from 'lucide-react';

interface SystemStatusProps {
  isAutoMode: boolean;
  lastUpdate: Date;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ isAutoMode, lastUpdate }) => {
  const services = [
    { name: 'News API', status: 'online', icon: Wifi },
    { name: 'AI Summarizer', status: 'online', icon: Activity },
    { name: 'TTS Engine', status: 'online', icon: Server },
    { name: 'Video Generator', status: 'online', icon: Database }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">
              {isAutoMode ? 'Auto Mode Active' : 'Manual Mode'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <service.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{service.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 capitalize">{service.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Last Update: {lastUpdate.toLocaleTimeString()}</p>
            <p className="mt-1">Next Check: {new Date(lastUpdate.getTime() + 5 * 60000).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;