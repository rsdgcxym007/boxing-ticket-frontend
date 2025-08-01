<template>
  <div class="flex flex-col min-h-screen bg-gray-900">
    <!-- Electron Menu Bar (only shown in Electron) -->
    <ElectronMenuBar v-if="isElectron" />

    <Navbar />
    <main class="flex-grow">
      <slot />
      <BaseLoading :visible="pageData.loading" />
    </main>

    <!-- Electron Update Notification -->
    <ElectronUpdateNotification />
  </div>
</template>

<script setup>
import { usePageData } from "@/stores/pageData";
import Navbar from "@/components/Navbar.vue";
import BaseLoading from "@/components/BaseLoading.vue";
import ElectronMenuBar from "@/components/ElectronMenuBar.vue";
import ElectronUpdateNotification from "@/components/ElectronUpdateNotification.vue";
import { useAuthStore } from "@/stores/auth";

const pageData = usePageData();
const auth = useAuthStore();
const { isElectron } = useElectron();

auth.loadUser();
</script>
