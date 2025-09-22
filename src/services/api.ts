const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // News API methods
  async fetchNews(params: { category?: string; country?: string; pageSize?: number } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    return this.request(`/news/fetch?${queryParams}`);
  }

  async searchNews(query: string, options: { sortBy?: string; pageSize?: number } = {}) {
    const queryParams = new URLSearchParams({ q: query });
    Object.entries(options).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    return this.request(`/news/search?${queryParams}`);
  }

  async summarizeText(text: string, maxLength?: number) {
    return this.request('/news/summarize', {
      method: 'POST',
      body: JSON.stringify({ text, maxLength }),
    });
  }

  // Video API methods
  async generateVideo(article: any, options: any = {}) {
    return this.request('/video/generate', {
      method: 'POST',
      body: JSON.stringify({ article, options }),
    });
  }

  async getVideoStatus(jobId: string) {
    return this.request(`/video/status/${jobId}`);
  }

  async generateSpeech(text: string, voice?: string) {
    const response = await fetch(`${API_BASE_URL}/video/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    return response.blob();
  }

  async uploadToYoutube(videoPath: string, title: string, description: string, tags: string[] = []) {
    return this.request('/video/upload-youtube', {
      method: 'POST',
      body: JSON.stringify({ videoPath, title, description, tags }),
    });
  }

  // Settings API methods
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings: any) {
    return this.request('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async testApis() {
    return this.request('/settings/test-apis', {
      method: 'POST',
    });
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;