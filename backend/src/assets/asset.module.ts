import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller.js';
import { AssetService } from './asset.service.js';
import { AssetRepository } from './asset.repository.js';

@Module({
  controllers: [AssetController],
  providers: [AssetService, AssetRepository],
  exports: [AssetService, AssetRepository],
})
export class AssetModule {}

