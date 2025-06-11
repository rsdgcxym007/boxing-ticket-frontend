<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow pb-28">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>
