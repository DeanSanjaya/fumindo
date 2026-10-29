<script setup lang="ts">
import { Box, Layers, PackageCheck, Archive } from 'lucide-vue-next';
import type { AssetStatsData } from '../types/asset';

defineProps<{
  stats: AssetStatsData | null;
  loading: boolean;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Asset Types -->
    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Item Asset</span>
        <div class="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
          <Layers class="w-4 h-4" />
        </div>
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="loading" class="h-7 w-16 bg-slate-100 animate-pulse rounded"></span>
        <span v-else class="text-2xl font-bold text-slate-900 tracking-tight">{{ stats?.totalAssets ?? 0 }}</span>
        <span class="text-xs text-slate-500">item terdaftar</span>
      </div>
    </div>

    <!-- Consumable -->
    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-amber-700 uppercase tracking-wider">Consumable</span>
        <div class="h-8 w-8 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
          <Archive class="w-4 h-4" />
        </div>
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="loading" class="h-7 w-16 bg-slate-100 animate-pulse rounded"></span>
        <span v-else class="text-2xl font-bold text-slate-900 tracking-tight">{{ stats?.consumableCount ?? 0 }}</span>
        <span class="text-xs text-slate-500">barang habis pakai</span>
      </div>
    </div>

    <!-- Non-Consumable -->
    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-blue-700 uppercase tracking-wider">Non-Consumable</span>
        <div class="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
          <PackageCheck class="w-4 h-4" />
        </div>
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="loading" class="h-7 w-16 bg-slate-100 animate-pulse rounded"></span>
        <span v-else class="text-2xl font-bold text-slate-900 tracking-tight">{{ stats?.nonConsumableCount ?? 0 }}</span>
        <span class="text-xs text-slate-500">peralatan & aset tetap</span>
      </div>
    </div>

    <!-- Total Stock Units -->
    <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kuantitas Stok</span>
        <div class="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
          <Box class="w-4 h-4" />
        </div>
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span v-if="loading" class="h-7 w-16 bg-slate-100 animate-pulse rounded"></span>
        <span v-else class="text-2xl font-bold text-slate-900 tracking-tight">{{ stats?.totalStock ?? 0 }}</span>
        <span class="text-xs text-slate-500">unit total</span>
      </div>
    </div>
  </div>
</template>

