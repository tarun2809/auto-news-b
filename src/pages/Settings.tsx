import React, { useState } from 'react';
import { Save, Key, Globe, Mic, Video, Bell } from 'lucide-react';
import { apiService } from '../services/api';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    newsApiKey: '',
    huggingFaceApiKey: '',
    youtubeApiKey: '',
    autoGenerationInterval: '6',
    voiceModel: 'en-US-Standard-A',
    videoResolution: '1080p',
    enableNotifications: true,
    autoPublishYoutube: false
  });

  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiService.getSettings();
      setSettings(response);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestApis = async () => {
    setLoading(true);
    try {
      const results = await apiService.testApis();
      setTestResults(results);
    } catch (error) {
      console.error('API test failed:', error);
      setTestResults({ error: 'Failed to test APIs' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your AutoNews system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Key className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NewsAPI Key
                </label>
                <input
                  type="password"
                  value={settings.newsApiKey}
                  onChange={(e) => handleInputChange('newsApiKey', e.target.value)}
                  placeholder="Enter your NewsAPI key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">newsapi.org</a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hugging Face API Key
                </label>
                <input
                  type="password"
                  value={settings.huggingFaceApiKey}
                  onChange={(e) => handleInputChange('huggingFaceApiKey', e.target.value)}
                  placeholder="Enter your Hugging Face API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">huggingface.co</a>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube API Key
                </label>
                <input
                  type="password"
                  value={settings.youtubeApiKey}
                  onChange={(e) => handleInputChange('youtubeApiKey', e.target.value)}
                  placeholder="Enter your YouTube API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set up YouTube Data API v3 in Google Cloud Console
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleTestApis}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                >
                  <span>Test API Connections</span>
                </button>
                
                {testResults && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(testResults).map(([api, result]: [string, any]) => (
                      <div key={api} className={`p-2 rounded text-sm ${
                        result.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        <strong>{api}:</strong> {result.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Automation</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Generation Interval (hours)
                </label>
                <select
                  value={settings.autoGenerationInterval}
                  onChange={(e) => handleInputChange('autoGenerationInterval', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Every hour</option>
                  <option value="3">Every 3 hours</option>
                  <option value="6">Every 6 hours</option>
                  <option value="12">Every 12 hours</option>
                  <option value="24">Daily</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Auto-publish to YouTube</span>
                <button
                  onClick={() => handleInputChange('autoPublishYoutube', !settings.autoPublishYoutube)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.autoPublishYoutube ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.autoPublishYoutube ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Mic className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Voice & Audio</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Model
                </label>
                <select
                  value={settings.voiceModel}
                  onChange={(e) => handleInputChange('voiceModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en-US-Standard-A">English (US) - Female</option>
                  <option value="en-US-Standard-B">English (US) - Male</option>
                  <option value="en-GB-Standard-A">English (UK) - Female</option>
                  <option value="en-GB-Standard-B">English (UK) - Male</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Video Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Resolution
                </label>
                <select
                  value={settings.videoResolution}
                  onChange={(e) => handleInputChange('videoResolution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
                <button
                  onClick={() => handleInputChange('enableNotifications', !settings.enableNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;