<template>
  <footer
    class="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 text-white bg-gray-900 backdrop-blur-md shadow-md z-50"
  >
    <div
      class="max-w-7xl mx-auto px-4 py-3 flex flex-col items-center gap-1 md:flex-row md:justify-between"
    >
      <!-- Brand -->
      <div
        class="text-sm md:text-base font-semibold tracking-widest text-center"
      >
        <span class="text-white">PATONG</span>
        <span class="text-green-400">BOXING</span>
      </div>

      <!-- Social + Phone -->
      <div class="flex items-center gap-5 mt-1 md:mt-0">
        <!-- Icons -->
        <div class="flex gap-4 text-lg">
          <a
            href="https://facebook.com"
            target="_blank"
            class="hover:text-blue-400 transition hover:scale-110"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://line.me/ti/p/~your-line-id"
            target="_blank"
            class="hover:text-green-400 transition hover:scale-110"
            aria-label="Line"
          >
            <i class="fab fa-line"></i>
          </a>
          <a
            href="https://wa.me/66817377193"
            target="_blank"
            class="hover:text-green-500 transition hover:scale-110"
            aria-label="WhatsApp"
          >
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>

        <!-- Phone -->
        <a
          href="tel:+66817377193"
          class="text-sm flex items-center gap-2 text-white hover:text-yellow-300 transition hover:scale-105"
        >
          <i class="mdi mdi-phone text-base"></i> +66 81 737 7193
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Optional subtle fade-in if desired */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
