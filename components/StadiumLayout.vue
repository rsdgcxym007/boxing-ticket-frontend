<template>
  <div
    class="w-full overflow-x-auto bg-gradient-to-b from-gray-100 to-white py-6 px-4 rounded-xl shadow-inner"
  >
    <div class="min-w-[768px] mx-auto flex flex-col items-center gap-8">
      <!-- BACK SECTION -->
      <div class="grid grid-cols-2 gap-8 sm:gap-16 justify-center w-full">
        <!-- BACK LEFT -->
        <div class="flex flex-col items-end gap-2">
          <span class="text-xs font-bold text-blue-600 mb-1">BACK LEFT</span>
          <div
            v-for="(row, i) in zones.backLeft"
            :key="'backLeft' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 0.8fr))`,
            }"
          >
            <template v-for="(seat, j) in row" :key="j">
              <SeatIcon
                v-if="seat"
                :seat="seat.toString()"
                :selectedSeats="selectedSeats"
                @toggle="toggleSeat"
              />
              <div v-else class="w-4 h-4" />
            </template>
          </div>
        </div>

        <!-- BACK RIGHT -->
        <div class="flex flex-col items-start gap-2">
          <span class="text-xs font-bold text-blue-600 mb-1">BACK RIGHT</span>
          <div
            v-for="(row, i) in zones.backRight"
            :key="'backRight' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 0.8fr))`,
            }"
          >
            <template v-for="(seat, j) in row" :key="j">
              <SeatIcon
                v-if="seat"
                :seat="seat.toString()"
                :selectedSeats="selectedSeats"
                @toggle="toggleSeat"
              />
              <div v-else class="w-4 h-4" />
            </template>
          </div>
        </div>
      </div>

      <!-- LEFT - STAGE - RIGHT -->
      <div class="grid grid-cols-3 gap-6 items-center w-full">
        <!-- LEFT -->
        <div class="flex flex-col gap-2 items-end">
          <span class="text-xs font-bold text-green-600 mb-1">LEFT</span>
          <div
            v-for="(row, i) in zones.left"
            :key="'left' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 0.8fr))`,
            }"
          >
            <template v-for="(seat, j) in row" :key="j">
              <SeatIcon
                v-if="seat"
                :seat="seat.toString()"
                :selectedSeats="selectedSeats"
                @toggle="toggleSeat"
              />
              <div v-else class="w-4 h-4" />
            </template>
          </div>
        </div>

        <!-- STAGE -->
        <div class="flex flex-col items-center justify-center">
          <div class="rounded-xl shadow-lg">
            <img
              src="/images/stadium.png"
              alt="Stage"
              class="w-full h-full object-contain"
            />
          </div>
          <SeatLegend class="mt-5" />
        </div>

        <!-- RIGHT -->
        <div class="flex flex-col gap-2 items-start">
          <span class="text-xs font-bold text-green-600 mb-1">RIGHT</span>
          <div
            v-for="(row, i) in zones.right"
            :key="'right' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 0.8fr))`,
            }"
          >
            <template v-for="(seat, j) in row" :key="j">
              <SeatIcon
                v-if="seat"
                :seat="seat.toString()"
                :selectedSeats="selectedSeats"
                @toggle="toggleSeat"
              />
              <div v-else class="w-4 h-4" />
            </template>
          </div>
        </div>
      </div>

      <!-- FRONT -->
      <div class="w-full">
        <span class="block text-center text-xs font-bold text-red-600 mb-2"
          >FRONT RINGSIDE</span
        >
        <div class="flex flex-col gap-2 items-center">
          <div
            v-for="(row, i) in zones.frontRingside"
            :key="'frontRingside' + i"
            class="grid gap-1 justify-center"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 0.8fr))`,
            }"
          >
            <template v-for="(seat, j) in row" :key="j">
              <SeatIcon
                v-if="seat"
                :seat="seat.toString()"
                :selectedSeats="selectedSeats"
                @toggle="toggleSeat"
              />
              <div v-else class="w-4 h-4" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SeatIcon from "./SeatIcon.vue";
import StadiumLayout from "./StadiumLayout.vue";

const props = defineProps({
  zones: Object,
  selectedSeats: Array,
  bookedSeats: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["update:selectedSeats"]);

function toggleSeat(seat) {
  if (props.bookedSeats.includes(seat)) return;

  const newSelection = [...props.selectedSeats];
  const index = newSelection.indexOf(seat);

  if (index === -1) {
    if (newSelection.length >= 10) {
      alert("คุณสามารถเลือกที่นั่งได้สูงสุด 10 ที่");
      return;
    }
    newSelection.push(seat);
  } else {
    newSelection.splice(index, 1);
  }

  emits("update:selectedSeats", newSelection);
}
</script>
