import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateAssetDto } from './dto/create-asset.dto.js';
import type { UpdateAssetDto } from './dto/update-asset.dto.js';
import type { QueryAssetDto } from './dto/query-asset.dto.js';
import type { asset as AssetModel, Prisma } from '@prisma/client';

@Injectable()
export class AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: QueryAssetDto): Promise<AssetModel[]> {
    const where: Prisma.assetWhereInput = {};

    if (query?.search && query.search.trim() !== '') {
      where.asset_name = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    if (query?.category && query.category !== 'All') {
      where.category = query.category;
    }

    const orderBy: Prisma.assetOrderByWithRelationInput = {};
    const sortBy = query?.sortBy || 'asset_id';
    const sortOrder = query?.sortOrder || 'asc';
    orderBy[sortBy as keyof Prisma.assetOrderByWithRelationInput] = sortOrder;

    return this.prisma.asset.findMany({
      where,
      orderBy,
    });
  }

  async findById(assetId: number): Promise<AssetModel | null> {
    return this.prisma.asset.findUnique({
      where: { asset_id: assetId },
    });
  }

  async create(data: CreateAssetDto): Promise<AssetModel> {
    return this.prisma.asset.create({
      data: {
        asset_name: data.asset_name.trim(),
        stock_quantity: data.stock_quantity,
        category: data.category,
      },
    });
  }

  async update(assetId: number, data: UpdateAssetDto): Promise<AssetModel> {
    const updateData: Prisma.assetUpdateInput = {};

    if (data.asset_name !== undefined) {
      updateData.asset_name = data.asset_name.trim();
    }
    if (data.stock_quantity !== undefined) {
      updateData.stock_quantity = data.stock_quantity;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
    }
    updateData.updated_at = new Date();

    return this.prisma.asset.update({
      where: { asset_id: assetId },
      data: updateData,
    });
  }

  async delete(assetId: number): Promise<AssetModel> {
    return this.prisma.asset.delete({
      where: { asset_id: assetId },
    });
  }

  async getStats() {
    const [totalAssets, consumableCount, nonConsumableCount, stockAggregate] = await Promise.all([
      this.prisma.asset.count(),
      this.prisma.asset.count({ where: { category: 'Consumable' } }),
      this.prisma.asset.count({ where: { category: 'Non-Consumable' } }),
      this.prisma.asset.aggregate({
        _sum: {
          stock_quantity: true,
        },
      }),
    ]);

    return {
      totalAssets,
      consumableCount,
      nonConsumableCount,
      totalStock: stockAggregate._sum.stock_quantity || 0,
    };
  }
}

