<template>
  <div class="scan-history-arena muay-thai-page">
    <!-- Combat Background -->
    <div class="arena-background">
      <div class="history-lights"></div>
      <div class="battle-records"></div>
      <div class="scroll-effects"></div>
    </div>

    <!-- History Content -->
    <div class="history-content">
      <!-- Page Header -->
      <header class="history-header">
        <button class="back-btn combat-btn" @click="goBack">
          <Icon icon="mdi:arrow-left" class="back-icon" />
        </button>

        <div class="header-title">
          <h1 class="page-title combat-text">📜 BATTLE HISTORY 📜</h1>
          <p class="page-subtitle">ARENA SCAN RECORDS</p>
        </div>

        <button
          class="filter-btn combat-btn"
          @click="showFilters = !showFilters"
        >
          <Icon icon="mdi:filter-variant" class="filter-icon" />
        </button>
      </header>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filter-options">
          <div class="filter-group">
            <label class="filter-label combat-text">PERIOD</label>
            <select v-model="selectedPeriod" class="filter-select combat-input">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label combat-text">STATUS</label>
            <select v-model="selectedStatus" class="filter-select combat-input">
              <option value="all">All Scans</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button class="apply-filter-btn combat-btn" @click="applyFilters">
            <Icon icon="mdi:check" class="apply-icon" />
            <span class="combat-text">APPLY</span>
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <section class="quick-summary">
        <div class="summary-cards">
          <div class="summary-card total">
            <Icon icon="mdi:chart-timeline-variant" class="summary-icon" />
            <div class="summary-data">
              <span class="summary-value combat-text">{{
                filteredScans.length
              }}</span>
              <span class="summary-label">Total Scans</span>
            </div>
          </div>

          <div class="summary-card success">
            <Icon icon="mdi:check-circle" class="summary-icon" />
            <div class="summary-data">
              <span class="summary-value combat-text">{{
                successfulScans
              }}</span>
              <span class="summary-label">Successful</span>
            </div>
          </div>

          <div class="summary-card failed">
            <Icon icon="mdi:alert-circle" class="summary-icon" />
            <div class="summary-data">
              <span class="summary-value combat-text">{{ failedScans }}</span>
              <span class="summary-label">Failed</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Search Bar -->
      <section class="search-section">
        <div class="search-wrapper">
          <Icon icon="mdi:magnify" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by customer name, order ID..."
            class="search-input combat-input"
          />
          <button
            v-if="searchQuery"
            class="clear-search-btn"
            @click="searchQuery = ''"
          >
            <Icon icon="mdi:close" class="clear-icon" />
          </button>
        </div>
      </section>

      <!-- Scan History List -->
      <section class="history-list-section">
        <div v-if="isLoading" class="loading-state">
          <div class="combat-spinner large"></div>
          <p class="loading-text">Loading battle records...</p>
        </div>

        <div v-else-if="filteredScans.length === 0" class="empty-state">
          <Icon icon="mdi:history" class="empty-icon" />
          <h3 class="empty-title combat-text">NO BATTLE RECORDS</h3>
          <p class="empty-message">
            {{
              searchQuery
                ? "No scans match your search criteria."
                : "No scan history found for the selected period."
            }}
          </p>
          <button class="clear-filters-btn combat-btn" @click="clearFilters">
            <Icon icon="mdi:filter-remove" class="btn-icon" />
            <span class="combat-text">CLEAR FILTERS</span>
          </button>
        </div>

        <div v-else class="scans-list">
          <div
            v-for="scan in paginatedScans"
            :key="scan.id"
            class="scan-record"
            :class="{
              success: scan.result === 'success',
              failed: scan.result === 'failed',
            }"
            @click="showScanDetails(scan)"
          >
            <!-- Scan Status Indicator -->
            <div class="scan-status">
              <div class="status-icon-wrapper">
                <Icon
                  :icon="
                    scan.result === 'success'
                      ? 'mdi:check-circle'
                      : 'mdi:alert-circle'
                  "
                  class="status-icon"
                />
                <div class="status-glow"></div>
              </div>
            </div>

            <!-- Scan Information -->
            <div class="scan-info">
              <div class="scan-header">
                <h3 class="customer-name combat-text">
                  {{ scan.customerName || "Unknown Fighter" }}
                </h3>
                <span class="scan-time">{{ formatTime(scan.timestamp) }}</span>
              </div>

              <div class="scan-details">
                <div class="detail-row">
                  <Icon icon="mdi:ticket" class="detail-icon" />
                  <span class="detail-text">{{
                    scan.orderId || "No Order ID"
                  }}</span>
                </div>
                <div class="detail-row" v-if="scan.location">
                  <Icon icon="mdi:map-marker" class="detail-icon" />
                  <span class="detail-text">{{ scan.location }}</span>
                </div>
                <div class="detail-row" v-if="scan.error">
                  <Icon icon="mdi:alert" class="detail-icon" />
                  <span class="detail-text error">{{ scan.error }}</span>
                </div>
              </div>
            </div>

            <!-- Scan Actions -->
            <div class="scan-actions">
              <button
                class="action-btn view-btn"
                @click.stop="showScanDetails(scan)"
              >
                <Icon icon="mdi:eye" class="action-icon" />
              </button>
              <button
                v-if="scan.result === 'failed'"
                class="action-btn retry-btn"
                @click.stop="retryScan(scan)"
              >
                <Icon icon="mdi:refresh" class="action-icon" />
              </button>
            </div>

            <!-- Battle Effect -->
            <div class="battle-effect" v-if="scan.result === 'success'">
              <Icon icon="mdi:fire" class="fire-icon" />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon icon="mdi:chevron-left" class="page-icon" />
          </button>

          <div class="page-info">
            <span class="current-page combat-text">{{ currentPage }}</span>
            <span class="page-separator">of</span>
            <span class="total-pages combat-text">{{ totalPages }}</span>
          </div>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <Icon icon="mdi:chevron-right" class="page-icon" />
          </button>
        </div>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation activeTab="history" />

    <!-- Scan Details Modal -->
    <ScanDetailsModal
      v-if="showDetailsModal"
      :scan="selectedScan"
      @close="showDetailsModal = false"
      @retry="retryScan"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useQRScannerStore } from "@/stores/qrScanner";
import { useRouter } from "vue-router";
import BottomNavigation from "@/components/Mobile/BottomNavigation.vue";
import ScanDetailsModal from "@/components/Mobile/ScanDetailsModal.vue";

// Composables
const qrStore = useQRScannerStore();
const router = useRouter();

// State
const isLoading = ref(false);
const showFilters = ref(false);
const showDetailsModal = ref(false);
const selectedScan = ref(null);

// Filters
const selectedPeriod = ref("all");
const selectedStatus = ref("all");
const searchQuery = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Computed
const scanHistory = computed(() => qrStore.scanHistory || []);

const filteredScans = computed(() => {
  let scans = [...scanHistory.value];

  // Filter by period
  if (selectedPeriod.value !== "all") {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedPeriod.value) {
      case "today":
        filterDate.setDate(now.getDate());
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }

    scans = scans.filter((scan) => new Date(scan.timestamp) >= filterDate);
  }

  // Filter by status
  if (selectedStatus.value !== "all") {
    scans = scans.filter((scan) => scan.result === selectedStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    scans = scans.filter(
      (scan) =>
        (scan.customerName &&
          scan.customerName.toLowerCase().includes(query)) ||
        (scan.orderId && scan.orderId.toLowerCase().includes(query)) ||
        (scan.location && scan.location.toLowerCase().includes(query))
    );
  }

  // Sort by timestamp (newest first)
  return scans.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
});

const successfulScans = computed(
  () => filteredScans.value.filter((scan) => scan.result === "success").length
);

const failedScans = computed(
  () => filteredScans.value.filter((scan) => scan.result === "failed").length
);

const totalPages = computed(() =>
  Math.ceil(filteredScans.value.length / itemsPerPage.value)
);

const paginatedScans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredScans.value.slice(start, end);
});

// Methods
const goBack = () => {
  router.back();
};

const applyFilters = () => {
  currentPage.value = 1;
  showFilters.value = false;
};

const clearFilters = () => {
  selectedPeriod.value = "all";
  selectedStatus.value = "all";
  searchQuery.value = "";
  currentPage.value = 1;
  showFilters.value = false;
};

const showScanDetails = (scan) => {
  selectedScan.value = scan;
  showDetailsModal.value = true;
};

const retryScan = async (scan) => {
  try {
    // Navigate to scanner with retry data
    await router.push({
      path: "/mobile/scanner",
      query: { retry: scan.qrData },
    });
  } catch (error) {
    console.error("Failed to retry scan:", error);
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

const formatTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    return "Invalid Date";
  }
};

const loadData = async () => {
  isLoading.value = true;
  try {
    // Load scan history if needed
    await qrStore.loadHistoryFromStorage();
  } catch (error) {
    console.error("Failed to load scan history:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watchers
watch([selectedPeriod, selectedStatus, searchQuery], () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  loadData();
});

// Page meta
definePageMeta({
  layout: "mobile",
});

useSeoMeta({
  title: "Scan History - Battle Records",
  description: "View detailed scan history and battle records",
});
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Page Layout */
.scan-history-arena {
  min-height: 100vh;
  background: var(--dark-bg);
  position: relative;
  padding-bottom: 100px; /* Space for bottom nav */
}

/* Background Effects */
.arena-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.history-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 30% 20%,
      rgba(225, 6, 0, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 80%,
      rgba(255, 215, 0, 0.08) 0%,
      transparent 50%
    );
  animation: historyGlow 8s ease-in-out infinite alternate;
}

@keyframes historyGlow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

.battle-records {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 50px,
    rgba(255, 215, 0, 0.02) 50px,
    rgba(255, 215, 0, 0.02) 100px
  );
}

.scroll-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(225, 6, 0, 0.05) 50%,
    transparent 100%
  );
  animation: scrollEffect 10s linear infinite;
}

@keyframes scrollEffect {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* Content */
.history-content {
  position: relative;
  z-index: 1;
  padding: 1rem;
}

/* Header */
.history-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-top: env(safe-area-inset-top);
}

.back-btn,
.filter-btn {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  color: var(--primary-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:hover,
.filter-btn:hover {
  background: rgba(225, 6, 0, 0.8);
  border-color: var(--primary-gold);
}

.header-title {
  flex: 1;
  text-align: center;
}

.page-title {
  font-size: 1.4rem;
  color: var(--primary-red);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--primary-gold);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Filters Panel */
.filters-panel {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.filter-options {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--primary-gold);
  font-weight: 700;
  letter-spacing: 1px;
}

.filter-select {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  padding: 0.75rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.apply-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-red);
  border: 2px solid var(--primary-gold);
  border-radius: 8px;
  color: white;
  font-weight: 700;
  transition: all 0.3s ease;
}

.apply-filter-btn:hover {
  background: var(--primary-gold);
  color: var(--dark-bg);
}

/* Quick Summary */
.quick-summary {
  margin-bottom: 1.5rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.summary-card.total {
  border-color: var(--primary-gold);
}

.summary-card.success {
  border-color: #22c55e;
}

.summary-card.failed {
  border-color: var(--primary-red);
}

.summary-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.summary-card.total .summary-icon {
  color: var(--primary-gold);
}

.summary-card.success .summary-icon {
  color: #22c55e;
}

.summary-card.failed .summary-icon {
  color: var(--primary-red);
}

.summary-value {
  font-size: 1.5rem;
  color: var(--primary-gold);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  color: var(--primary-gold);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  color: var(--text-light);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-red);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search-btn:hover {
  color: var(--primary-red);
}

/* Loading & Empty States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
}

.combat-spinner.large {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  border-top: 3px solid var(--primary-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-muted);
  opacity: 0.5;
}

.empty-title {
  font-size: 1.2rem;
  color: var(--primary-gold);
  margin: 0;
}

.empty-message {
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
  max-width: 300px;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: var(--text-light);
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: var(--primary-red);
  border-color: var(--primary-gold);
}

/* Scan Records List */
.scans-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.scan-record {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.scan-record:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.scan-record.success {
  border-color: rgba(34, 197, 94, 0.5);
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.scan-record.failed {
  border-color: rgba(225, 6, 0, 0.5);
  background: linear-gradient(
    135deg,
    rgba(225, 6, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Scan Status */
.scan-status {
  flex-shrink: 0;
}

.status-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.status-icon {
  font-size: 2rem;
  z-index: 2;
}

.scan-record.success .status-icon {
  color: #22c55e;
}

.scan-record.failed .status-icon {
  color: var(--primary-red);
}

.status-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  opacity: 0.6;
  animation: statusGlow 2s ease-in-out infinite alternate;
}

.scan-record.success .status-glow {
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.3) 0%,
    transparent 70%
  );
}

.scan-record.failed .status-glow {
  background: radial-gradient(circle, rgba(225, 6, 0, 0.3) 0%, transparent 70%);
}

@keyframes statusGlow {
  0% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* Scan Info */
.scan-info {
  flex: 1;
  min-width: 0;
}

.scan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.customer-name {
  font-size: 1.1rem;
  color: var(--primary-gold);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scan-time {
  font-size: 0.8rem;
  color: var(--text-muted);
  flex-shrink: 0;
  margin-left: 1rem;
}

.scan-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.detail-icon {
  font-size: 1rem;
  color: var(--primary-red);
  flex-shrink: 0;
}

.detail-text {
  color: var(--text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-text.error {
  color: #ef4444;
}

/* Scan Actions */
.scan-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: var(--primary-gold);
  color: var(--dark-bg);
  border-color: var(--primary-gold);
}

.retry-btn:hover {
  background: var(--primary-red);
  color: white;
  border-color: var(--primary-red);
}

.action-icon {
  font-size: 1.1rem;
}

/* Battle Effect */
.battle-effect {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  animation: battleFlicker 2s ease-in-out infinite alternate;
}

.fire-icon {
  font-size: 1.2rem;
  color: var(--primary-gold);
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8));
}

@keyframes battleFlicker {
  0% {
    opacity: 0.2;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

.page-btn {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  color: var(--primary-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-red);
  border-color: var(--primary-gold);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.current-page {
  color: var(--primary-gold);
  font-size: 1.2rem;
}

.page-separator {
  color: var(--text-muted);
}

.total-pages {
  color: var(--text-light);
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-options {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .scan-record {
    padding: 0.75rem;
  }

  .scan-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .scan-time {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .history-content {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 1.2rem;
  }

  .scan-actions {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
