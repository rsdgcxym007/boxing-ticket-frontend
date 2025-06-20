<template>
  <div class="flex flex-col min-h-screen bg-gray-900">
    <Navbar />
    <main class="flex-grow">
      <slot />
      <BaseLoading :visible="pageData.loading" />
    </main>
  </div>
</template>

<script setup>
import { usePageData } from "@/stores/pageData";
import Navbar from "@/components/Navbar.vue";
import BaseLoading from "@/components/BaseLoading.vue";
const pageData = usePageData();
</script>
