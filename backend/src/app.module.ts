import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AssetModule } from './assets/asset.module.js';

@Module({
  imports: [PrismaModule, AssetModule],
})
export class AppModule {}
