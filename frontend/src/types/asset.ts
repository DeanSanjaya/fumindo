export type AssetCategory = 'Consumable' | 'Non-Consumable';

export interface Asset {
  asset_id: number;
  asset_name: string;
  stock_quantity: number;
  category: AssetCategory;
  created_at?: string;
  updated_at?: string;
}

export interface AssetFormData {
  asset_name: string;
  stock_quantity: number | '';
  category: AssetCategory;
}

export interface AssetStatsData {
  totalAssets: number;
  consumableCount: number;
  nonConsumableCount: number;
  totalStock: number;
}

