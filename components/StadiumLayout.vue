<template>
  <!-- Scrollable Wrapper -->
  <div class="w-full overflow-x-auto">
    <div class="min-w-[768px] mx-auto flex flex-col items-center gap-4">
      <!-- BACK SECTION -->
      <div class="grid grid-cols-2 gap-8 sm:gap-16 justify-center">
        <!-- BACK LEFT -->
        <div class="flex flex-col items-end">
          <div
            v-for="(row, i) in zones.backLeft"
            :key="'backLeft' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 1fr))`,
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
        <div class="flex flex-col items-start">
          <div
            v-for="(row, i) in zones.backRight"
            :key="'backRight' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 1fr))`,
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
      <div class="grid grid-cols-3 gap-4 items-start mt-4">
        <!-- LEFT -->
        <div class="flex flex-col gap-1 items-end">
          <div
            v-for="(row, i) in zones.left"
            :key="'left' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 1fr))`,
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
        <div class="flex justify-center items-center">
          <img src="/images/stadium.png" alt="Stadium" class="object-contain" />
        </div>

        <!-- RIGHT -->
        <div class="flex flex-col gap-1 items-start">
          <div
            v-for="(row, i) in zones.right"
            :key="'right' + i"
            class="grid gap-1"
            :style="{
              gridTemplateColumns: `repeat(${row.length}, minmax(16px, 1fr))`,
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
      <div
        v-for="(row, i) in zones.frontRingside"
        :key="'frontRingside' + i"
        class="grid gap-1"
        :style="{
          gridTemplateColumns: `repeat(${row.length}, minmax(16px, 1fr))`,
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
</template>

<script setup>
import SeatIcon from "./SeatIcon.vue";

const props = defineProps({
  zones: Object,
  selectedSeats: Array,
});

const emits = defineEmits(["update:selectedSeats"]);

function toggleSeat(seat) {
  const updated = [...props.selectedSeats];
  const i = updated.indexOf(seat);
  if (i === -1) updated.push(seat);
  else updated.splice(i, 1);
  emits("update:selectedSeats", updated);
}
</script>
