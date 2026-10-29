import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryAssetDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['Consumable', 'Non-Consumable', 'All'])
  category?: string;

  @IsOptional()
  @IsIn(['asset_id', 'asset_name', 'stock_quantity', 'category', 'created_at'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}

