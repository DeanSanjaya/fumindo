<script setup lang="ts">
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next';

defineProps<{
  notification: {
    type: 'success' | 'error';
    message: string;
  } | null;
}>();

const emit = defineEmits<{
  (e: 'dismiss'): void;
}>();
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="notification"
      class="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 pointer-events-auto"
      :class="notification.type === 'success' ? 'border-emerald-200' : 'border-rose-200'"
    >
      <div class="flex items-start gap-3">
        <div class="shrink-0 mt-0.5">
          <CheckCircle2 v-if="notification.type === 'success'" class="w-5 h-5 text-emerald-600" />
          <AlertCircle v-else class="w-5 h-5 text-rose-600" />
        </div>
        <div class="flex-1">
          <p
            class="text-xs font-semibold uppercase tracking-wider"
            :class="notification.type === 'success' ? 'text-emerald-800' : 'text-rose-800'"
          >
            {{ notification.type === 'success' ? 'Sukses' : 'Gagal' }}
          </p>
          <p class="text-sm text-slate-700 mt-0.5">
            {{ notification.message }}
          </p>
        </div>
        <button
          type="button"
          @click="emit('dismiss')"
          class="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  </transition>
</template>

