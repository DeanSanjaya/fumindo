import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { AssetCategory } from '../entities/asset.entity.js';

export class UpdateAssetDto {
  @IsOptional()
  @IsString({ message: 'Nama asset harus berupa teks' })
  asset_name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Jumlah stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Jumlah stok tidak boleh kurang dari 0' })
  stock_quantity?: number;

  @IsOptional()
  @IsIn(['Consumable', 'Non-Consumable'], {
    message: 'Kategori harus berupa Consumable atau Non-Consumable',
  })
  category?: AssetCategory;
}

