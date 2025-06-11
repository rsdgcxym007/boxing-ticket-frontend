<template>
  <div class="relative bg-[#f5f6fa] min-h-screen p-6">
    <h2 class="text-2xl font-bold mb-6">เลือกที่นั่งสนามมวย</h2>

    <!-- STAGE -->
    <div class="flex justify-center mb-4">
      <div class="bg-blue-900 text-white py-2 px-6 rounded-xl shadow-lg">
        STAGE
      </div>
    </div>

    <!-- FRONT -->
    <ZoneGroup title="RINGSIDE FRONT" :zone="'RINGSIDE FRONT'" />

    <!-- REGULAR TOP -->
    <ZoneGroup title="REGULAR TOP" :zone="'REGULAR TOP'" color="gray" />

    <!-- LEFT + RIGHT SIDE -->
    <div class="absolute left-0 top-[35%] rotate-[-90deg] origin-left">
      <RegularArcSide :zone="'REGULAR LEFT'" />
    </div>
    <div class="absolute right-0 top-[35%] rotate-[90deg] origin-right">
      <RegularArcSide :zone="'REGULAR RIGHT'" />
    </div>

    <!-- BACK -->
    <ZoneGroup title="CENTER BACK" :zone="'CENTER BACK'" color="gray" />

    <!-- SUMMARY -->
    <BookingSummary />
  </div>
</template>

<script setup>
import ZoneGroup from "~/components/ZoneGroup.vue";
import RegularArcSide from "~/components/RegularArcSide.vue";
import BookingSummary from "~/components/BookingSummary.vue";
</script>
