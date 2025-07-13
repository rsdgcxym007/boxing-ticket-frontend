<template>
  <div
    class="flex items-center justify-between py-4 px-6 bg-white border-t border-gray-200"
  >
    <!-- Page Info -->
    <div class="flex items-center gap-4 text-sm text-gray-600">
      <span>
        แสดง {{ startItem }}-{{ endItem }} จาก {{ totalItems }} รายการ
      </span>
      <select
        v-model="itemsPerPage"
        @change="$emit('itemsPerPageChange', itemsPerPage)"
        class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option :value="10">10 รายการ</option>
        <option :value="20">20 รายการ</option>
        <option :value="50">50 รายการ</option>
        <option :value="100">100 รายการ</option>
      </select>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center gap-2">
      <!-- First Page -->
      <button
        @click="$emit('pageChange', 1)"
        :disabled="currentPage === 1"
        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="หน้าแรก"
      >
        <i class="mdi mdi-page-first text-sm"></i>
      </button>

      <!-- Previous Page -->
      <button
        @click="$emit('pageChange', currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="หน้าก่อน"
      >
        <i class="mdi mdi-chevron-left text-sm"></i>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="$emit('pageChange', page as number)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-indigo-600 text-white shadow-md'
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 py-2 text-gray-400">...</span>
        </template>
      </div>

      <!-- Next Page -->
      <button
        @click="$emit('pageChange', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="หน้าถัดไป"
      >
        <i class="mdi mdi-chevron-right text-sm"></i>
      </button>

      <!-- Last Page -->
      <button
        @click="$emit('pageChange', totalPages)"
        :disabled="currentPage === totalPages"
        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="หน้าสุดท้าย"
      >
        <i class="mdi mdi-page-last text-sm"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPageProp: {
    type: Number,
    default: 20,
  },
});

const emit = defineEmits<{
  pageChange: [page: number];
  itemsPerPageChange: [itemsPerPage: number];
}>();

const itemsPerPage = ref(props.itemsPerPageProp);

const startItem = computed(() => {
  return (props.currentPage - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * itemsPerPage.value, props.totalItems);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = 7;

  if (props.totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (props.currentPage > 4) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(props.totalPages - 1, props.currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== props.totalPages) {
        pages.push(i);
      }
    }

    if (props.currentPage < props.totalPages - 3) {
      pages.push("...");
    }

    // Always show last page if more than 1 page
    if (props.totalPages > 1) {
      pages.push(props.totalPages);
    }
  }

  return pages;
});
</script>

<style scoped>
/* Custom styling for pagination if needed */
</style>
