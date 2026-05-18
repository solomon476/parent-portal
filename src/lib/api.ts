/**
 * SomoBloom API Client (Parent Portal)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api';

class ApiClient {
  private tokenKey: string;

  constructor() {
    this.tokenKey = 'parent_token';
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[Offline Sync] Parent Portal restored online. Replaying operations...');
        this.syncOfflineQueue();
      });
      setTimeout(() => this.syncOfflineQueue(), 1000);
    }
  }

  private getHeaders(contentType: string = 'application/json') {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const cacheKey = `somobloom_cache:${this.tokenKey}:${endpoint}`;
    
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.warn(`[Offline] Serving cached data for GET ${endpoint}`);
        return JSON.parse(cached) as T;
      }
      throw new Error('No internet connection, and no cached data is available.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await this.handleResponse(response);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.warn(`[Offline Fallback] Network failed. Serving cached data for GET ${endpoint}`);
        return JSON.parse(cached) as T;
      }
      throw err;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.mutate<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.mutate<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.mutate<T>('DELETE', endpoint, null);
  }

  private async mutate<T>(method: 'POST' | 'PUT' | 'DELETE', endpoint: string, data: any): Promise<T> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.queueMutation(method, endpoint, data);
      console.warn(`[Offline] Queued mutation: ${method} ${endpoint}`);
      return { success: true, offlineQueued: true } as any;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse(response);
    } catch (err) {
      this.queueMutation(method, endpoint, data);
      console.warn(`[Offline Fallback] Network failed. Queued mutation: ${method} ${endpoint}`);
      return { success: true, offlineQueued: true } as any;
    }
  }

  private queueMutation(method: string, endpoint: string, data: any) {
    const queueKey = `somobloom_queue:${this.tokenKey}`;
    const rawQueue = localStorage.getItem(queueKey);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];

    const isDuplicate = queue.some((item: any) => 
      item.method === method && 
      item.endpoint === endpoint && 
      JSON.stringify(item.data) === JSON.stringify(data)
    );

    if (!isDuplicate) {
      queue.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        method,
        endpoint,
        data,
        timestamp: Date.now()
      });
      localStorage.setItem(queueKey, JSON.stringify(queue));
    }
  }

  private async syncOfflineQueue() {
    const queueKey = `somobloom_queue:${this.tokenKey}`;
    const rawQueue = localStorage.getItem(queueKey);
    if (!rawQueue) return;

    let queue = JSON.parse(rawQueue);
    if (queue.length === 0) return;

    console.log(`[Offline Sync] Syncing ${queue.length} pending operations...`);
    const remaining: any[] = [];

    for (const item of queue) {
      try {
        await fetch(`${API_BASE_URL}${item.endpoint}`, {
          method: item.method,
          headers: this.getHeaders(),
          body: item.data ? JSON.stringify(item.data) : undefined,
        });
        console.log(`[Offline Sync] Synced operation successfully: ${item.method} ${item.endpoint}`);
      } catch (err) {
        console.error(`[Offline Sync] Sync failed for: ${item.method} ${item.endpoint}. Will retry later.`, err);
        remaining.push(item);
      }
    }

    localStorage.setItem(queueKey, JSON.stringify(remaining));
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

export const api = new ApiClient();
