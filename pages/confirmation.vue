<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 space-y-6 text-gray-800"
    >
      <h1 class="text-2xl font-bold text-center text-green-600">
        🎉 การสั่งซื้อเสร็จสมบูรณ์
      </h1>

      <div class="text-sm text-gray-700 space-y-2">
        <p>
          <span class="font-medium text-gray-800">หมายเลขคำสั่งซื้อ:</span>
          <span class="text-blue-600 font-semibold">ORD-{{ orderId }}</span>
        </p>
        <p>
          <span class="font-medium text-gray-800">โซน:</span>
          {{ zone.toUpperCase() }}
        </p>
        <p>
          <span class="font-medium text-gray-800">ที่นั่ง:</span>
          {{ selectedSeats.join(", ") }}
        </p>
        <p>
          <span class="font-medium text-gray-800">ราคารวม:</span>
          <span class="text-blue-600 font-semibold">{{ total }} บาท</span>
        </p>
      </div>

      <div class="text-center pt-6 space-y-3">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium"
        >
          กลับหน้าหลัก
        </NuxtLink>
        <NuxtLink
          to="/my-purchase"
          class="inline-block px-5 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 text-sm font-medium"
        >
          ดูคำสั่งซื้อของฉัน
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

const orderId = route.query.orderId || "000001";
const selectedSeats = route.query.seats
  ? Array.isArray(route.query.seats)
    ? route.query.seats
    : route.query.seats.split(",")
  : [];
const zone = route.query.zone || "-";
const total = route.query.total || 0;
</script>
