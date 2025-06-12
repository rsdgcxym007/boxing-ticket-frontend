<template>
  <section class="min-h-screen bg-[#0b0f1a] px-4 py-12 text-white relative">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-extrabold text-red-600 mb-1">
        CONTACT <span class="text-white">US</span>
      </h2>
      <p class="text-lg font-bold text-yellow-400 mb-8 tracking-wide">
        CONTACT INFORMATION
      </p>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#111827] p-6 rounded-2xl shadow-2xl border border-gray-800"
      >
        <!-- Contact Person -->
        <div class="flex items-start gap-4">
          <i class="fa-solid fa-user text-lg text-blue-400 mt-1"></i>
          <div>
            <p class="text-sm text-gray-400">Contact Person</p>
            <p class="font-semibold text-white">Reservation</p>
          </div>
        </div>

        <!-- Address -->
        <div class="flex items-start gap-4">
          <i class="fa-solid fa-location-dot text-lg text-green-400 mt-1"></i>
          <div>
            <p class="text-sm text-gray-400">Current Address</p>
            <p class="text-white leading-tight">
              2/59 Sai Nam Yen Road<br />Patong Beach, Amphur Kathu<br />Phuket,
              83150 Thailand
            </p>
          </div>
        </div>

        <!-- Telephone -->
        <div class="flex items-start gap-4">
          <i class="fa-brands fa-whatsapp text-lg text-green-500 mt-1"></i>
          <div>
            <p class="text-sm text-gray-400">Telephone</p>
            <a
              href="https://wa.me/66817377193"
              target="_blank"
              class="text-green-300 font-medium underline"
              >+66 81 737 7193</a
            >
          </div>
        </div>

        <!-- Email -->
        <div class="flex items-start gap-4">
          <i class="fa-solid fa-envelope text-lg text-yellow-300 mt-1"></i>
          <div>
            <p class="text-sm text-gray-400">Email Address</p>
            <p>
              <a
                href="mailto:info@boxingstadiumpatong.com"
                class="underline text-yellow-300"
                >info@boxingstadiumpatong.com</a
              ><br />
              <a
                href="mailto:freshy_tour@hotmail.com"
                class="underline text-yellow-300"
                >freshy_tour@hotmail.com</a
              >
            </p>
          </div>
        </div>

        <!-- Website -->
        <div class="flex items-start gap-4">
          <i class="fa-solid fa-globe text-lg text-blue-300 mt-1"></i>
          <div>
            <p class="text-sm text-gray-400">Website</p>
            <a
              href="http://www.boxingstadiumpatong.com"
              target="_blank"
              class="underline text-yellow-300"
              >www.boxingstadiumpatong.com</a
            >
          </div>
        </div>

        <!-- Map -->
        <div class="flex items-start gap-4">
          <i
            class="fa-solid fa-map-location-dot text-lg text-pink-400 mt-1"
          ></i>
          <div>
            <p class="text-sm text-gray-400">Maps</p>
            <a
              href="https://goo.gl/KAvEYh"
              target="_blank"
              class="underline text-orange-300"
              >goo.gl/KAvEYh</a
            >
          </div>
        </div>
      </div>
      <!-- Floating Buttons -->
      <div class="fixed z-50 bottom-6 right-6 flex flex-col gap-4">
        <a
          href="https://m.me/BoxingPhuket"
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
        >
          <i class="fa-brands fa-facebook-messenger text-lg"></i>
        </a>
        <a
          href="https://wa.me/66817377193"
          target="_blank"
          class="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition"
        >
          <i class="fa-brands fa-whatsapp text-lg"></i>
        </a>
        <a
          href="tel:+66817377193"
          class="bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg transition"
        >
          <i class="fa-solid fa-phone text-lg"></i>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed for this contact page
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>
