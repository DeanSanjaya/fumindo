<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import type { Asset, AssetCategory, AssetFormData } from '../types/asset';

const props = defineProps<{
  isOpen: boolean;
  editingAsset: Asset | null;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: { asset_name: string; stock_quantity: number; category: AssetCategory }): void;
}>();

const form = ref<AssetFormData>({
  asset_name: '',
  stock_quantity: 0,
  category: 'Non-Consumable',
});

const errors = ref<{
  asset_name?: string;
  stock_quantity?: string;
  category?: string;
}>({});

watch(
  () => props.isOpen,
  (open) => {
    errors.value = {};
    if (open) {
      if (props.editingAsset) {
        form.value = {
          asset_name: props.editingAsset.asset_name,
          stock_quantity: props.editingAsset.stock_quantity,
          category: props.editingAsset.category,
        };
      } else {
        form.value = {
          asset_name: '',
          stock_quantity: 0,
          category: 'Non-Consumable',
        };
      }
    }
  },
  { immediate: true },
);

function validate(): boolean {
  errors.value = {};
  let valid = true;

  if (!form.value.asset_name || form.value.asset_name.trim() === '') {
    errors.value.asset_name = 'Nama asset tidak boleh kosong';
    valid = false;
  }

  if (form.value.stock_quantity === '' || form.value.stock_quantity === null || isNaN(Number(form.value.stock_quantity))) {
    errors.value.stock_quantity = 'Jumlah stok harus diisi';
    valid = false;
  } else if (Number(form.value.stock_quantity) < 0) {
    errors.value.stock_quantity = 'Stok tidak boleh bernilai negatif';
    valid = false;
  }

  if (!form.value.category) {
    errors.value.category = 'Kategori harus dipilih';
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;

  emit('save', {
    asset_name: form.value.asset_name.trim(),
    stock_quantity: Number(form.value.stock_quantity),
    category: form.value.category,
  });
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      @click="emit('close')"
    ></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 class="text-base font-semibold text-slate-900">
              {{ editingAsset ? 'Edit Data Asset' : 'Tambah Asset Baru' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ editingAsset ? `Perbarui data untuk asset #${editingAsset.asset_id}` : 'Masukkan rincian asset inventaris baru' }}
            </p>
          </div>
          <button
            type="button"
            @click="emit('close')"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Asset Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Asset <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.asset_name"
              placeholder="Contoh: Mesin Fogging Fumigasi F-100"
              class="w-full px-3 py-2 text-sm bg-white border rounded-md transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900/20"
              :class="errors.asset_name ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-slate-800'"
            />
            <p v-if="errors.asset_name" class="mt-1 text-xs text-rose-500">{{ errors.asset_name }}</p>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kategori Asset <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="flex flex-col p-3 border rounded-md cursor-pointer transition-colors"
                :class="form.category === 'Consumable' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value="Consumable"
                    v-model="form.category"
                    class="text-amber-600 focus:ring-amber-500"
                  />
                  <span class="text-sm font-medium text-slate-800">Consumable</span>
                </div>
                <span class="text-xs text-slate-500 mt-1 pl-5">Barang habis pakai (tinta, cairan, obat)</span>
              </label>

              <label
                class="flex flex-col p-3 border rounded-md cursor-pointer transition-colors"
                :class="form.category === 'Non-Consumable' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:bg-slate-50'"
              >
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value="Non-Consumable"
                    v-model="form.category"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-slate-800">Non-Consumable</span>
                </div>
                <span class="text-xs text-slate-500 mt-1 pl-5">Aset fisik tetap (printer, laptop, mesin)</span>
              </label>
            </div>
            <p v-if="errors.category" class="mt-1 text-xs text-rose-500">{{ errors.category }}</p>
          </div>

          <!-- Stock Quantity -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Jumlah Stok <span class="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              v-model="form.stock_quantity"
              placeholder="0"
              class="w-full px-3 py-2 text-sm bg-white border rounded-md transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-900/20"
              :class="errors.stock_quantity ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-slate-800'"
            />
            <p v-if="errors.stock_quantity" class="mt-1 text-xs text-rose-500">{{ errors.stock_quantity }}</p>
          </div>

          <!-- Modal Footer Actions -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="emit('close')"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <span>{{ saving ? 'Menyimpan...' : (editingAsset ? 'Simpan Perubahan' : 'Simpan Asset') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

