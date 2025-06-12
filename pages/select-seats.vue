<template>
  <div
    class="relative min-h-screen bg-gradient-to-b from-white to-sky-100 pb-32 py-4"
  >
    <!-- Header -->
    <div class="mb-4 text-center">
      <h1 class="text-xl font-semibold text-gray-800 uppercase tracking-wider">
        เลือกที่นั่ง
      </h1>
      <p class="text-sm text-gray-500 font-medium mt-1">
        โซน
        <span class="text-blue-600 font-bold">
          {{ zoneKey.replace("-", " ").toUpperCase() }}
        </span>
      </p>
    </div>

    <!-- Seat Layout -->
    <div class="w-full overflow-x-auto rounded-xl bg-white shadow-md p-4">
      <div class="flex flex-col items-center gap-3 min-w-[600px]">
        <div
          v-for="(row, i) in currentZoneSeats"
          :key="i"
          class="grid justify-center"
          :style="{
            gridTemplateColumns: `repeat(${row.length}, minmax(1.5rem, auto))`,
            gap: '0.5rem',
          }"
        >
          <div v-for="seat in row" :key="seat" @click="toggleSeat(seat)">
            <SeatIcon
              :seat="seat"
              :status="getSeatStatus(seat)"
              :selectedSeats="selectedSeats"
              :bookedSeats="bookedSeats"
              class="w-8 sm:w-10 md:w-12"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Seat Legend (always visible at bottom) -->
    <div
      class="left-0 w-full bg-white/90 backdrop-blur-sm border-t shadow-md px-4 py-3 flex justify-center gap-6 z-40"
    >
      <div class="flex items-center gap-2">
        <img src="/images/armchair.png" alt="ว่าง" class="w-5 h-5" />
        <span class="text-sm text-gray-600">ว่าง</span>
      </div>
      <div class="flex items-center gap-2">
        <img
          src="/images/seat-selected.png"
          alt="ที่คุณเลือก"
          class="w-5 h-5"
        />
        <span class="text-sm text-blue-600">ที่คุณเลือก</span>
      </div>
      <div class="flex items-center gap-2">
        <img
          src="/images/seat-booked.png"
          alt="ไม่ว่าง"
          class="w-5 h-5 opacity-50"
        />
        <span class="text-sm text-gray-400 line-through">ไม่ว่าง</span>
      </div>
    </div>

    <!-- Floating Selection Info (only if seat selected) -->
    <transition name="fade">
      <div
        v-if="selectedSeats.length"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-50 w-[95%] text-center"
      >
        <p class="text-gray-600 text-sm font-medium">
          ที่นั่งที่เลือก:
          <span class="font-bold text-blue-600">
            {{ selectedSeats.join(", ") }}
          </span>
        </p>
        <p class="text-gray-800 text-base font-semibold mt-2">
          ราคารวม: {{ selectedSeats.length * 1500 }} บาท
        </p>
        <div class="flex justify-center mt-4 gap-4">
          <button
            @click="router.go(-1)"
            class="px-4 py-2 rounded-full border border-blue-500 text-blue-500 font-semibold hover:bg-blue-50 transition"
          >
            ย้อนกลับ
          </button>
          <button
            class="px-5 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition"
          >
            ซื้อตั๋ว
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const router = useRouter();
const route = useRoute();
const zoneKey = computed(() => route.query.zone || "back-left");
const currentZoneSeats = computed(() => seatZones[zoneKey.value] || []);

const seatZones = {
  "back-left": [
    ["470", "471", "472", "473", "474", "475", "476", "477", "478"],
    ["451", "452", "453", "454", "455", "456", "457", "458"],
    ["435", "436", "437", "438", "439", "440", "441"],
    ["421", "422", "423", "424", "425", "426"],
    ["409", "410", "411", "412", "413"],
    ["401", "402", "403", "404"],
  ],
  "back-right": [
    ["482", "483", "484", "485", "486", "487", "488", "489", "490", "491"],
    ["461", "462", "463", "464", "465", "466", "467", "468"],
    ["444", "445", "446", "447", "448", "449", "450"],
    ["429", "430", "431", "432", "433", "434"],
    ["416", "417", "418", "419", "420"],
    ["407", "408"],
  ],
  left: [
    ["386"],
    ["385", "363", "343"],
    ["384", "362", "342", "324"],
    ["383", "361", "341", "323"],
    ["382", "360", "340", "322"],
    ["381", "359", "339", "321"],
    ["380", "358", "338", "320", "309"],
    ["379", "357", "337", "319", "308"],
    ["378", "356", "336", "318", "307"],
    ["377", "355", "335", "317", "306"],
    ["376", "354", "334", "316", "305"],
    ["375"],
    ["374", "353", "333", "315", "304"],
    ["373", "352", "332", "314", "303"],
    ["372", "351", "331", "313", "302"],
    ["371", "350", "330", "312", "301"],
    ["370", "349", "329", "311"],
    ["369", "348", "328", "310"],
    ["368", "347", "327"],
    ["367", "346", "326"],
    ["366", "345", "325"],
    ["365", "344"],
    ["364"],
  ],
  right: [
    ["124", "143", "163"],
    ["125", "144", "164"],
    ["126", "145", "165"],
    ["127", "146", "166"],
    ["110", "128", "147", "167"],
    ["111", "129", "148", "168"],
    ["101", "112", "130", "149", "169"],
    ["102", "113", "131", "150", "170"],
    ["103", "114", "132", "151", "171"],
    ["104", "115", "133", "152", "172"],
    ["173"],
    ["105", "116", "134", "153", "174"],
    ["106", "117", "135", "154", "175"],
    ["107", "118", "136", "155", "176"],
    ["108", "119", "137", "156", "177"],
    ["109", "120", "138", "157", "178"],
    ["121", "139", "158", "179"],
    ["122", "140", "159", "180"],
    ["123", "141", "160", "181"],
    ["142", "161", "182"],
    ["162", "183"],
    ["184"],
    ["185"],
  ],
  "front-ringside": [
    ["204", "203", "202", "201"],
    [
      "220",
      "219",
      "218",
      "217",
      "216",
      "215",
      "214",
      "213",
      "212",
      "211",
      "210",
      "209",
      "208",
      "207",
      "206",
    ],

    [
      "236",
      "235",
      "234",
      "233",
      "232",
      "231",
      "230",
      "229",
      "228",
      "227",
      "226",
      "225",
      "224",
      "223",
      "222",
      "221",
    ],

    [
      "252",
      "251",
      "250",
      "249",
      "248",
      "247",
      "246",
      "245",
      "244",
      "243",
      "242",
      "241",
      "240",
      "239",
      "238",
      "237",
    ],
    [
      "268",
      "267",
      "266",
      "265",
      "264",
      "263",
      "262",
      "261",
      "260",
      "259",
      "258",
      "257",
      "256",
      "255",
      "254",
      "253",
    ],
  ],
};

const selectedSeats = ref([]);
const bookedSeats = ref(["471", "402", "403"]);

function toggleSeat(seat) {
  if (bookedSeats.value.includes(seat)) return;

  const index = selectedSeats.value.indexOf(seat);
  if (index === -1) {
    if (selectedSeats.value.length >= 10) return;
    selectedSeats.value.push(seat);
  } else {
    selectedSeats.value.splice(index, 1);
  }
}

function getSeatStatus(seat) {
  if (!seat) return "unavailable";
  if (bookedSeats.value?.includes(seat)) return "booked";
  if (selectedSeats.value.includes(seat)) return "selected";
  return "available";
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
