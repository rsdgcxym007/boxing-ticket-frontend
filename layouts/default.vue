<template>
  <div class="flex flex-col min-h-screen bg-gray-900">
    <Navbar />
    <main class="flex-grow pb-25">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>
