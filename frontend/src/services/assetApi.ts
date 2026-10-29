import type { Asset, AssetCategory, AssetStatsData } from '../types/asset';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      (data && (data.message || (Array.isArray(data.message) ? data.message.join(', ') : ''))) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data as T;
}

export const assetApi = {
  async getAssets(params?: {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Asset[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const qs = query.toString();
    return request<Asset[]>(`/assets${qs ? `?${qs}` : ''}`);
  },

  async getStats(): Promise<AssetStatsData> {
    return request<AssetStatsData>('/assets/stats');
  },

  async getAssetById(id: number): Promise<Asset> {
    return request<Asset>(`/assets/${id}`);
  },

  async createAsset(data: {
    asset_name: string;
    stock_quantity: number;
    category: AssetCategory;
  }): Promise<Asset> {
    return request<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAsset(
    id: number,
    data: {
      asset_name?: string;
      stock_quantity?: number;
      category?: AssetCategory;
    },
  ): Promise<Asset> {
    return request<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAsset(id: number): Promise<{ message: string; deletedAsset: Asset }> {
    return request<{ message: string; deletedAsset: Asset }>(`/assets/${id}`, {
      method: 'DELETE',
    });
  },
};
