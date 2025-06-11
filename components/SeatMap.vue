<template>
  <div class="flex flex-col items-center gap-3">
    <h1 class="text-xl font-bold text-center">เลือกที่นั่งสนามมวย Sainamyen</h1>

    <!-- REGULAR BACK -->
    <SeatRow
      zone="REGULAR BACK"
      :seats="zones.back.seats"
      :selectedSeats="selectedSeats"
      @toggle="toggleSeat"
    />

    <!-- ช่องว่างทางเดินเวที -->
    <div class="h-4" />

    <!-- STAGE + SIDE ZONES -->
    <div class="grid grid-cols-3 gap-8 items-start">
      <!-- LEFT ZONES -->
      <div class="flex flex-col items-end gap-2">
        <SeatRow
          v-for="row in zones.left"
          :key="row.zone"
          :zone="row.zone"
          :seats="row.seats"
          :selectedSeats="selectedSeats"
          @toggle="toggleSeat"
        />
      </div>

      <!-- STAGE -->
      <div
        class="bg-blue-500 text-white font-bold rounded-xl px-6 py-6 text-center"
      >
        เวที
      </div>

      <!-- RIGHT ZONES -->
      <div class="flex flex-col items-start gap-2">
        <SeatRow
          v-for="row in zones.right"
          :key="row.zone"
          :zone="row.zone"
          :seats="row.seats"
          :selectedSeats="selectedSeats"
          @toggle="toggleSeat"
        />
      </div>
    </div>

    <!-- RINGSIDE FRONT -->
    <SeatRow
      zone="RINGSIDE FRONT"
      :seats="zones.topRingside.seats"
      :selectedSeats="selectedSeats"
      @toggle="toggleSeat"
    />

    <!-- CENTER FRONT -->
    <SeatRow
      zone="CENTER FRONT"
      :seats="zones.centerFront.seats"
      :selectedSeats="selectedSeats"
      @toggle="toggleSeat"
    />
  </div>
</template>

<script setup>
import SeatRow from "./SeatRow.vue";

const props = defineProps({
  zones: Object,
  selectedSeats: Array,
});

const emits = defineEmits(["update:selectedSeats"]);

const bookedSeats = ["R5", "L10"]; // mock data

function toggleSeat(seat) {
  if (bookedSeats.includes(seat)) return;

  const newSelection = [...props.selectedSeats];
  const index = newSelection.indexOf(seat);

  if (index === -1) {
    newSelection.push(seat);
  } else {
    newSelection.splice(index, 1);
  }

  emits("update:selectedSeats", newSelection);
}
</script>

<style scoped></style>
