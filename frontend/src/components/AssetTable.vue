<script setup lang="ts">
import { ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2, AlertCircle, PackageOpen } from 'lucide-vue-next';
import type { Asset } from '../types/asset';

const props = defineProps<{
  assets: Asset[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'sort', column: string): void;
  (e: 'edit', asset: Asset): void;
  (e: 'delete', asset: Asset): void;
}>();

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}
</script>

<template>
  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-700">
        <thead class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none">
          <tr>
            <th
              scope="col"
              @click="emit('sort', 'asset_id')"
              class="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors w-20"
            >
              <div class="flex items-center gap-1.5">
                <span>ID</span>
                <span class="text-slate-400">
                  <ArrowUp v-if="sortBy === 'asset_id' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowDown v-else-if="sortBy === 'asset_id' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowUpDown v-else class="w-3.5 h-3.5" />
                </span>
              </div>
            </th>

            <th
              scope="col"
              @click="emit('sort', 'asset_name')"
              class="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                <span>Nama Asset</span>
                <span class="text-slate-400">
                  <ArrowUp v-if="sortBy === 'asset_name' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowDown v-else-if="sortBy === 'asset_name' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowUpDown v-else class="w-3.5 h-3.5" />
                </span>
              </div>
            </th>

            <th
              scope="col"
              @click="emit('sort', 'category')"
              class="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors w-44"
            >
              <div class="flex items-center gap-1.5">
                <span>Kategori</span>
                <span class="text-slate-400">
                  <ArrowUp v-if="sortBy === 'category' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowDown v-else-if="sortBy === 'category' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowUpDown v-else class="w-3.5 h-3.5" />
                </span>
              </div>
            </th>

            <th
              scope="col"
              @click="emit('sort', 'stock_quantity')"
              class="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors w-36 text-right"
            >
              <div class="flex items-center justify-end gap-1.5">
                <span>Jumlah Stok</span>
                <span class="text-slate-400">
                  <ArrowUp v-if="sortBy === 'stock_quantity' && sortOrder === 'asc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowDown v-else-if="sortBy === 'stock_quantity' && sortOrder === 'desc'" class="w-3.5 h-3.5 text-slate-800" />
                  <ArrowUpDown v-else class="w-3.5 h-3.5" />
                </span>
              </div>
            </th>

            <th scope="col" class="py-3 px-4 hidden md:table-cell w-48 text-slate-500">
              Terakhir Diubah
            </th>

            <th scope="col" class="py-3 px-4 text-center w-28">
              Aksi
            </th>
          </tr>
        </thead>

        <!-- Loading State Skeleton -->
        <tbody v-if="loading" class="divide-y divide-slate-100">
          <tr v-for="n in 5" :key="n" class="animate-pulse">
            <td class="py-3.5 px-4"><div class="h-4 w-8 bg-slate-200 rounded"></div></td>
            <td class="py-3.5 px-4"><div class="h-4 w-48 bg-slate-200 rounded"></div></td>
            <td class="py-3.5 px-4"><div class="h-5 w-24 bg-slate-200 rounded-full"></div></td>
            <td class="py-3.5 px-4 text-right"><div class="h-4 w-12 bg-slate-200 rounded ml-auto"></div></td>
            <td class="py-3.5 px-4 hidden md:table-cell"><div class="h-4 w-28 bg-slate-200 rounded"></div></td>
            <td class="py-3.5 px-4 text-center"><div class="h-6 w-16 bg-slate-200 rounded mx-auto"></div></td>
          </tr>
        </tbody>

        <!-- Empty State -->
        <tbody v-else-if="assets.length === 0">
          <tr>
            <td colspan="6" class="py-12 px-4 text-center">
              <div class="max-w-xs mx-auto flex flex-col items-center">
                <div class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <PackageOpen class="w-6 h-6" />
                </div>
                <h3 class="text-sm font-semibold text-slate-800">Tidak ada data asset</h3>
                <p class="text-xs text-slate-500 mt-1">
                  Data asset yang dicari belum tersedia atau belum terdaftar.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Data Rows -->
        <tbody v-else class="divide-y divide-slate-100">
          <tr
            v-for="asset in assets"
            :key="asset.asset_id"
            class="hover:bg-slate-50/80 transition-colors group"
          >
            <!-- ID -->
            <td class="py-3.5 px-4 font-mono text-xs text-slate-500">
              #{{ asset.asset_id }}
            </td>

            <!-- Name -->
            <td class="py-3.5 px-4">
              <div class="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                {{ asset.asset_name }}
              </div>
            </td>

            <!-- Category Badge -->
            <td class="py-3.5 px-4">
              <span
                v-if="asset.category === 'Consumable'"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60"
              >
                Consumable
              </span>
              <span
                v-else
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
              >
                Non-Consumable
              </span>
            </td>

            <!-- Stock Quantity -->
            <td class="py-3.5 px-4 text-right">
              <div class="inline-flex items-center gap-1.5 justify-end">
                <span
                  v-if="asset.stock_quantity === 0"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200"
                  title="Stok habis"
                >
                  <AlertCircle class="w-3 h-3" />
                  Habis
                </span>
                <span
                  v-else-if="asset.stock_quantity <= 5"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
                  title="Stok menipis"
                >
                  <AlertCircle class="w-3 h-3" />
                  Stok Menipis
                </span>
                <span class="font-semibold text-slate-800 tabular-nums">
                  {{ asset.stock_quantity.toLocaleString('id-ID') }}
                </span>
              </div>
            </td>

            <!-- Last Updated -->
            <td class="py-3.5 px-4 text-xs text-slate-500 hidden md:table-cell tabular-nums">
              {{ formatDate(asset.updated_at || asset.created_at) }}
            </td>

            <!-- Actions -->
            <td class="py-3.5 px-4 text-center">
              <div class="flex items-center justify-center gap-1">
                <button
                  type="button"
                  @click="emit('edit', asset)"
                  class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  title="Edit Asset"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="emit('delete', asset)"
                  class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Hapus Asset"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer Info -->
    <div class="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
      <span>Menampilkan <strong>{{ assets.length }}</strong> data asset</span>
      <span class="text-slate-400">Database: asset_fumindo</span>
    </div>
  </div>
</template>
