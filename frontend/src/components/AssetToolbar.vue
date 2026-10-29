<script setup lang="ts">
import { Search, Plus, RotateCw, X } from 'lucide-vue-next';

defineProps<{
  search: string;
  category: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:category', value: string): void;
  (e: 'refresh'): void;
  (e: 'open-create'): void;
}>();

const categories = [
  { label: 'Semua Kategori', value: 'All' },
  { label: 'Consumable', value: 'Consumable' },
  { label: 'Non-Consumable', value: 'Non-Consumable' },
];
</script>

<template>
  <div class="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-xs">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search Input & Category Filter -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
        <!-- Search -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            type="text"
            :value="search"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
            placeholder="Cari nama asset..."
            class="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 transition-colors placeholder:text-slate-400"
          />
          <button
            v-if="search"
            @click="emit('update:search', '')"
            class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            title="Hapus pencarian"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Category Dropdown / Segment -->
        <div class="sm:w-52">
          <select
            :value="category"
            @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
            class="w-full py-2 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 transition-colors text-slate-700 cursor-pointer"
          >
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 self-end sm:self-auto">
        <!-- Refresh Button -->
        <button
          type="button"
          @click="emit('refresh')"
          :disabled="loading"
          class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 disabled:opacity-50 transition-colors cursor-pointer"
          title="Muat Ulang Data"
        >
          <RotateCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>

        <!-- Add Asset Button -->
        <button
          type="button"
          @click="emit('open-create')"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Asset</span>
        </button>
      </div>
    </div>
  </div>
</template>

