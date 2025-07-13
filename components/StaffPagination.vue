<template>
  <div class="pagination-container">
    <div class="flex items-center justify-between">
      <!-- Info -->
      <div class="text-sm text-gray-700">
        แสดง {{ startItem }} ถึง {{ endItem }} จาก {{ totalItems }} รายการ
      </div>

      <!-- Pagination -->
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <!-- Previous Button -->
        <button
          @click="goToPrevious"
          :disabled="currentPage === 1"
          class="pagination-btn pagination-btn-prev"
          :class="{ 'pagination-btn-disabled': currentPage === 1 }"
        >
          <i class="mdi mdi-chevron-left"></i>
          <span class="sr-only">Previous</span>
        </button>

        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page === '...'"
            disabled
            class="pagination-btn pagination-btn-ellipsis"
          >
            ...
          </button>
          <button
            v-else
            @click="goToPage(page as number)"
            class="pagination-btn"
            :class="[
              currentPage === page
                ? 'pagination-btn-active'
                : 'pagination-btn-inactive',
            ]"
          >
            {{ page }}
          </button>
        </template>

        <!-- Next Button -->
        <button
          @click="goToNext"
          :disabled="currentPage === totalPages"
          class="pagination-btn pagination-btn-next"
          :class="{ 'pagination-btn-disabled': currentPage === totalPages }"
        >
          <span class="sr-only">Next</span>
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
}

interface Emits {
  (e: "page-change", page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
});

const emit = defineEmits<Emits>();

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
});

const visiblePages = computed(() => {
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (
    let i = Math.max(2, props.currentPage - delta);
    i <= Math.min(props.totalPages - 1, props.currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push("...", props.totalPages);
  } else {
    rangeWithDots.push(props.totalPages);
  }

  return rangeWithDots.filter((page, index, array) => {
    return page !== array[index - 1] && page !== array[index + 1];
  });
});

const goToPrevious = () => {
  if (props.currentPage > 1) {
    emit("page-change", props.currentPage - 1);
  }
};

const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    emit("page-change", props.currentPage + 1);
  }
};

const goToPage = (page: number) => {
  if (page !== props.currentPage) {
    emit("page-change", page);
  }
};
</script>

<style scoped>
.pagination-container {
  background-color: white;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .pagination-container {
    padding: 0.75rem 1.5rem;
  }
}

.pagination-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
  transition: colors 0.2s;
}

.pagination-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}

.pagination-btn-prev {
  border-radius: 0.375rem 0 0 0.375rem;
}

.pagination-btn-next {
  border-radius: 0 0.375rem 0.375rem 0;
}

.pagination-btn-active {
  z-index: 10;
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.pagination-btn-inactive {
  background-color: white;
  border-color: #d1d5db;
  color: #6b7280;
}

.pagination-btn-inactive:hover {
  background-color: #f9fafb;
}

.pagination-btn-disabled {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.pagination-btn-ellipsis {
  background-color: white;
  border-color: #d1d5db;
  color: #6b7280;
  cursor: default;
}
</style>
