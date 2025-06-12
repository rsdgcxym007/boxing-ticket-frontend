<template>
  <div
    class="relative w-full bg-gradient-to-b from-black via-zinc-900 to-black flex justify-center items-center overflow-hidden"
  >
    <div
      class="relative w-full max-w-[1000px] aspect-[1/1] md:aspect-[1000/1000] shadow-2xl rounded-xl overflow-hidden"
    >
      <img
        src="/images/stage_steage.png"
        alt="stadium background"
        class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />

      <svg
        viewBox="0 0 1000 1000"
        class="absolute inset-0 w-full h-full z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              flood-color="#ffffff"
            />
          </filter>
        </defs>

        <g v-for="zone in zones" :key="zone.id">
          <polygon
            :points="zone.points"
            :fill="selectedZone?.id === zone.id ? darken(zone.fill) : zone.fill"
            :stroke="selectedZone?.id === zone.id ? '#fff' : 'white'"
            stroke-width="2"
            class="cursor-pointer transition duration-300"
            :style="selectedZone?.id === zone.id ? 'filter: url(#glow)' : ''"
            @click="selectZone(zone)"
          />
          <text
            :x="zone.labelX"
            :y="zone.labelY"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="18"
            fill="white"
            class="pointer-events-none font-extrabold drop-shadow"
          >
            {{ zone.name }}
          </text>
        </g>
      </svg>
    </div>

    <transition name="fade">
      <div
        v-if="selectedZone"
        class="fixed bottom-4 mb-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-xl p-4 md:p-6 rounded-xl z-50 w-[95%] max-w-md border border-gray-200"
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
        <p class="text-gray-700 text-sm md:text-base">
          รายละเอียดโซน เช่น ราคาบัตร จำนวนที่นั่ง และสิทธิพิเศษต่าง ๆ
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const selectedZone = ref(null);
const router = useRouter();
function darken(color) {
  // Darken the original hex color by about 20%
  const hex = color.replace("#", "");
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
  return `rgb(${r},${g},${b})`;
}

const zones = [
  {
    id: "back-left",
    name: "BACK LEFT",
    fill: "#ca8a04",
    labelX: 340,
    labelY: 130,
    points: "470,70 210,70 210,190 300,269 470,270",
  },
  {
    id: "back-right",
    name: "BACK RIGHT",
    fill: "#ea580c",
    labelX: 650,
    labelY: 130,
    points: "535,70 814,70 690,260 550,260 535,255",
  },
  {
    id: "left",
    name: "LEFT",
    fill: "#c2410c",
    labelX: 250,
    labelY: 400,
    points: "170,165 310,270 310,650 280,700 170,800 170,300",
  },
  {
    id: "right",
    name: "RIGHT",
    fill: "#dc2626",
    labelX: 740,
    labelY: 400,
    points: "690,260 810,70 830,70 835,770 690,650 689,400",
  },
  {
    id: "front-ringside",
    name: "FRONT RINGSIDE",
    fill: "#2563eb",
    labelX: 500,
    labelY: 750,
    points: "300,669 710,670 809,830 190,832",
  },
];

function selectZone(zone) {
  selectedZone.value = zone;
  router.push({ path: "/select-seats", query: { zone: zone.id } });
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

function handleScroll() {
  const threshold = 100; // ปรับตามที่ต้องการ
  if (window.scrollY > threshold && selectedZone.value) {
    selectedZone.value = null;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
