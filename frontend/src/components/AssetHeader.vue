<script setup lang="ts">
import { Box } from 'lucide-vue-next';
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand & Title -->
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Box class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">PT Fumindo</span>
              <span class="h-1 w-1 rounded-full bg-slate-300"></span>
              <span class="text-xs text-slate-400">Inventory</span>
            </div>
            <h1 class="text-base font-semibold text-slate-900 tracking-tight">
              Manajemen Data Asset
            </h1>
          </div>
        </div>

        <!-- System Status Indicator -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>API & Database Aktif</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
