export type AssetCategory = 'Consumable' | 'Non-Consumable';

export class AssetEntity {
  asset_id: number;
  asset_name: string;
  stock_quantity: number;
  category: AssetCategory;
  created_at?: Date | null;
  updated_at?: Date | null;
}

