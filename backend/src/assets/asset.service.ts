import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssetRepository } from './asset.repository.js';
import type { CreateAssetDto } from './dto/create-asset.dto.js';
import type { UpdateAssetDto } from './dto/update-asset.dto.js';
import type { QueryAssetDto } from './dto/query-asset.dto.js';
import type { AssetEntity } from './entities/asset.entity.js';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async getAllAssets(query?: QueryAssetDto): Promise<AssetEntity[]> {
    return this.assetRepository.findAll(query) as Promise<AssetEntity[]>;
  }

  async getAssetById(assetId: number): Promise<AssetEntity> {
    if (isNaN(assetId)) {
      throw new BadRequestException('ID asset harus berupa angka');
    }

    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset dengan ID #${assetId} tidak ditemukan`);
    }

    return asset as AssetEntity;
  }

  async createAsset(dto: CreateAssetDto): Promise<AssetEntity> {
    if (dto.stock_quantity < 0) {
      throw new BadRequestException('Stok asset tidak boleh kurang dari 0');
    }

    return this.assetRepository.create(dto) as Promise<AssetEntity>;
  }

  async updateAsset(assetId: number, dto: UpdateAssetDto): Promise<AssetEntity> {
    // Check if asset exists
    await this.getAssetById(assetId);

    if (dto.stock_quantity !== undefined && dto.stock_quantity < 0) {
      throw new BadRequestException('Stok asset tidak boleh kurang dari 0');
    }

    return this.assetRepository.update(assetId, dto) as Promise<AssetEntity>;
  }

  async deleteAsset(assetId: number): Promise<{ message: string; deletedAsset: AssetEntity }> {
    const existing = await this.getAssetById(assetId);
    const deleted = await this.assetRepository.delete(assetId);

    return {
      message: `Asset "${existing.asset_name}" berhasil dihapus`,
      deletedAsset: deleted as AssetEntity,
    };
  }

  async getStats() {
    return this.assetRepository.getStats();
  }
}

