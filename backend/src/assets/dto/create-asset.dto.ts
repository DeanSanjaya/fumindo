import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { AssetCategory } from '../entities/asset.entity.js';

export class CreateAssetDto {
  @IsNotEmpty({ message: 'Nama asset tidak boleh kosong' })
  @IsString({ message: 'Nama asset harus berupa teks' })
  asset_name: string;

  @Type(() => Number)
  @IsInt({ message: 'Jumlah stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Jumlah stok tidak boleh kurang dari 0' })
  stock_quantity: number;

  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  @IsIn(['Consumable', 'Non-Consumable'], {
    message: 'Kategori harus berupa Consumable atau Non-Consumable',
  })
  category: AssetCategory;
}

