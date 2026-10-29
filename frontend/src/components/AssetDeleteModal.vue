<script setup lang="ts">
import { AlertTriangle, Loader2 } from 'lucide-vue-next';
import type { Asset } from '../types/asset';

defineProps<{
  isOpen: boolean;
  asset: Asset | null;
  deleting: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>

<template>
  <div v-if="isOpen && asset" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      @click="emit('close')"
    ></div>

    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 p-6"
        @click.stop
      >
        <div class="flex items-start gap-4">
          <div class="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-rose-600">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-slate-900">Hapus Data Asset</h3>
            <p class="text-sm text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus asset
              <strong class="text-slate-900">"{{ asset.asset_name }}"</strong>
              (ID: #{{ asset.asset_id }})?
            </p>
            <p class="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded border border-rose-100">
              Perhatian: Data yang dihapus tidak dapat dipulihkan kembali dari database.
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            @click="emit('close')"
            :disabled="deleting"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="emit('confirm')"
            :disabled="deleting"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="deleting" class="w-4 h-4 animate-spin" />
            <span>{{ deleting ? 'Menghapus...' : 'Ya, Hapus Asset' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

