<template>
  <div
    class="relative w-full bg-black flex justify-center items-center overflow-hidden"
  >
    <!-- Wrapper with fixed aspect ratio (square or stadium size) -->
    <div
      class="relative w-full max-w-[1000px] aspect-[1/1] md:aspect-[1000/1000]"
    >
      <!-- Stadium Image Background -->
      <img
        src="/images/stage_steage.png"
        alt="stadium background"
        class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />

      <!-- SVG Overlay -->
      <svg
        viewBox="0 0 1000 1000"
        class="absolute inset-0 w-full h-full z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <g v-for="zone in zones" :key="zone.id">
          <polygon
            :points="zone.points"
            :fill="selectedZone?.id === zone.id ? '#ffffff88' : zone.fill"
            stroke="white"
            stroke-width="2"
            class="cursor-pointer hover:opacity-80 transition duration-300"
            @click="selectZone(zone)"
          />
          <text
            :x="zone.labelX"
            :y="zone.labelY"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="16"
            fill="white"
            class="pointer-events-none font-bold drop-shadow"
          >
            {{ zone.name }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Zone Info Panel -->
    <div
      v-if="selectedZone"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-4 md:p-6 rounded-xl z-50 w-[95%] max-w-md border border-gray-200"
    >
      <div class="flex justify-between items-center mb-2 md:mb-3">
        <h2 class="text-lg md:text-xl font-semibold text-gray-800">
          {{ selectedZone.name }}
        </h2>
        <button
          @click="selectedZone = null"
          class="text-red-500 font-bold text-xl hover:text-red-700"
        >
          ✕
        </button>
      </div>
      <p class="text-gray-600 text-sm md:text-base">
        รายละเอียดโซน เช่น ราคาบัตร จำนวนที่นั่ง และสิทธิพิเศษต่าง ๆ
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedZone = ref(null);
{
  /* <polygon points="x1,y1 x2,y2 x3,y3 x4,y4 ..." /> */
}

const zones = [
  {
    id: "back-left",
    name: "BACK LEFT",
    fill: "#ca8a04cc",
    labelX: 340,
    labelY: 130,
    points: "470,70 210,70 210,190 300,269 470,270",
  },
  {
    id: "back-right",
    name: "BACK RIGHT",
    fill: "#ea580ccc",
    labelX: 650,
    labelY: 130,
    points: "535,70 814,70 690,260 550,260 535,255",
  },
  {
    id: "left",
    name: "LEFT",
    fill: "#c2410ccc",
    labelX: 250,
    labelY: 400,
    points: "170,165 310,270 310,650 280,700 170,800 170,300",
  },
  {
    id: "right",
    name: "RIGHT",
    fill: "#dc2626cc",
    labelX: 740,
    labelY: 400,
    points: "690,260 810,70 830,70 835,770 690,650 689,400",
  },
  {
    id: "front-ringside",
    name: "FRONT RINGSIDE",
    fill: "#2563ebcc",
    labelX: 500,
    labelY: 750,
    points: "300,669 710,670 809,830 190,832",
  },
];

function selectZone(zone) {
  selectedZone.value = zone;
}
</script>

<style scoped>
div {
  font-family: "Inter", sans-serif;
}
</style>
