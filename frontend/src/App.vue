<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import AssetHeader from "./components/AssetHeader.vue";
import AssetStats from "./components/AssetStats.vue";
import AssetToolbar from "./components/AssetToolbar.vue";
import AssetTable from "./components/AssetTable.vue";
import AssetFormModal from "./components/AssetFormModal.vue";
import AssetDeleteModal from "./components/AssetDeleteModal.vue";
import AssetNotification from "./components/AssetNotification.vue";
import { assetApi } from "./services/assetApi";
import type { Asset, AssetCategory, AssetStatsData } from "./types/asset";

// State
const assets = ref<Asset[]>([]);
const stats = ref<AssetStatsData | null>(null);
const loading = ref(false);
const statsLoading = ref(false);
const saving = ref(false);
const deleting = ref(false);

const search = ref("");
const category = ref("All");
const sortBy = ref("asset_id");
const sortOrder = ref<"asc" | "desc">("asc");

// Modals
const isFormOpen = ref(false);
const editingAsset = ref<Asset | null>(null);

const isDeleteOpen = ref(false);
const assetToDelete = ref<Asset | null>(null);

// Notification
const notification = ref<{ type: "success" | "error"; message: string } | null>(null);
let notificationTimer: ReturnType<typeof setTimeout> | null = null;

function notify(type: "success" | "error", message: string) {
  if (notificationTimer) clearTimeout(notificationTimer);
  notification.value = { type, message };
  notificationTimer = setTimeout(() => {
    notification.value = null;
  }, 4000);
}

// Fetching Data
async function fetchAssets() {
  loading.value = true;
  try {
    const data = await assetApi.getAssets({
      search: search.value,
      category: category.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
    assets.value = data;
  } catch (err: any) {
    notify("error", err.message || "Gagal memuat data asset dari server");
  } finally {
    loading.value = false;
  }
}

async function fetchStats() {
  statsLoading.value = true;
  try {
    stats.value = await assetApi.getStats();
  } catch (err: any) {
    console.error("Failed to load stats:", err);
  } finally {
    statsLoading.value = false;
  }
}

function refreshAll() {
  fetchAssets();
  fetchStats();
}

// Debounced Search & Filter Watchers
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(search, () => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    fetchAssets();
  }, 300);
});

watch(category, () => {
  fetchAssets();
});

// Sort handler
function handleSort(column: string) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortOrder.value = "asc";
  }
  fetchAssets();
}

// Create & Edit Handlers
function handleOpenCreate() {
  editingAsset.value = null;
  isFormOpen.value = true;
}

function handleOpenEdit(asset: Asset) {
  editingAsset.value = asset;
  isFormOpen.value = true;
}

async function handleSaveAsset(payload: { asset_name: string; stock_quantity: number; category: AssetCategory }) {
  saving.value = true;
  try {
    if (editingAsset.value) {
      await assetApi.updateAsset(editingAsset.value.asset_id, payload);
      notify("success", `Data asset "${payload.asset_name}" berhasil diperbarui.`);
    } else {
      await assetApi.createAsset(payload);
      notify("success", `Asset baru "${payload.asset_name}" berhasil ditambahkan.`);
    }
    isFormOpen.value = false;
    refreshAll();
  } catch (err: any) {
    notify("error", err.message || "Gagal menyimpan data asset.");
  } finally {
    saving.value = false;
  }
}

// Delete Handlers
function handleOpenDelete(asset: Asset) {
  assetToDelete.value = asset;
  isDeleteOpen.value = true;
}

async function handleConfirmDelete() {
  if (!assetToDelete.value) return;

  deleting.value = true;
  try {
    await assetApi.deleteAsset(assetToDelete.value.asset_id);
    notify("success", `Asset "${assetToDelete.value.asset_name}" berhasil dihapus.`);
    isDeleteOpen.value = false;
    assetToDelete.value = null;
    refreshAll();
  } catch (err: any) {
    notify("error", err.message || "Gagal menghapus asset.");
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  refreshAll();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
    <!-- Header -->
    <AssetHeader />

    <!-- Main Content Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Section Title & Description -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Daftar Asset Perusahaan</h2>
          <p class="text-sm text-slate-500 mt-0.5">Kelola stok dan klasifikasi kategori barang inventaris PT Fumindo secara terpusat.</p>
        </div>
      </div>

      <!-- Stats Metric Cards -->
      <AssetStats :stats="stats" :loading="statsLoading" />

      <!-- Toolbar (Search, Filter, Actions) -->
      <AssetToolbar v-model:search="search" v-model:category="category" :loading="loading" @refresh="refreshAll" @open-create="handleOpenCreate" />

      <!-- Asset Data Table -->
      <AssetTable :assets="assets" :loading="loading" :sort-by="sortBy" :sort-order="sortOrder" @sort="handleSort" @edit="handleOpenEdit" @delete="handleOpenDelete" />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">&copy; 2026 PT Fumindo Mandiri. Sistem Manajemen Aset &bull; PostgreSQL, NestJS & Vue.js</div>
    </footer>

    <!-- Form Modal (Create / Edit) -->
    <AssetFormModal :is-open="isFormOpen" :editing-asset="editingAsset" :saving="saving" @close="isFormOpen = false" @save="handleSaveAsset" />

    <!-- Delete Confirmation Modal -->
    <AssetDeleteModal :is-open="isDeleteOpen" :asset="assetToDelete" :deleting="deleting" @close="isDeleteOpen = false" @confirm="handleConfirmDelete" />

    <!-- Notification Toast -->
    <AssetNotification :notification="notification" @dismiss="notification = null" />
  </div>
</template>
