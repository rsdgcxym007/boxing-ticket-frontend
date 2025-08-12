<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-12 px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900">รายการโปรด</h1>
            <p class="text-gray-600 mt-2">เหตุการณ์และนักมวยที่คุณติดตาม</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="filterCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">หมวดหมู่ทั้งหมด</option>
              <option value="events">เหตุการณ์</option>
              <option value="fighters">นักมวย</option>
              <option value="venues">สถานที่</option>
            </select>
            <button
              @click="clearAllFavorites"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Icon icon="mdi:delete" />
              ลบทั้งหมด
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">เหตุการณ์โปรด</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ favoriteEvents.length }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon icon="mdi:calendar-heart" class="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">นักมวยโปรด</p>
              <p class="text-2xl font-bold text-green-600">
                {{ favoriteFighters.length }}
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon icon="mdi:account-heart" class="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">สถานที่โปรด</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ favoriteVenues.length }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon
                icon="mdi:map-marker-heart"
                class="text-2xl text-purple-600"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <nav class="flex border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 px-6 py-4 text-sm font-medium text-center transition-colors',
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            ]"
          >
            <Icon :icon="tab.icon" class="inline mr-2" />
            {{ tab.name }}
          </button>
        </nav>

        <div class="p-6">
          <!-- Events Tab -->
          <div v-if="activeTab === 'events'" class="space-y-6">
            <div
              v-for="event in filteredFavoriteEvents"
              :key="event.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex flex-col lg:flex-row gap-6">
                <img
                  :src="event.image || '/images/default-event.jpg'"
                  :alt="event.name"
                  class="w-full lg:w-48 h-32 lg:h-32 object-cover rounded-lg"
                />

                <div class="flex-1">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">
                        {{ event.name }}
                      </h3>
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span
                          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {{ event.category }}
                        </span>
                        <span
                          :class="getEventStatusClasses(event.status)"
                          class="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {{ getEventStatusText(event.status) }}
                        </span>
                      </div>
                    </div>
                    <button
                      @click="removeFavoriteEvent(event.id)"
                      class="text-red-500 hover:text-red-700 p-2"
                    >
                      <Icon icon="mdi:heart" class="text-xl" />
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:calendar" class="text-lg" />
                      <span>{{ formatDate(event.date) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:clock" class="text-lg" />
                      <span>{{ event.time }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:map-marker" class="text-lg" />
                      <span>{{ event.venue }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <Icon icon="mdi:currency-usd" class="text-lg" />
                      <span>จาก ฿{{ event.priceFrom.toLocaleString() }}</span>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button
                      v-if="event.status === 'upcoming'"
                      @click="bookTicket(event.id)"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      จองตั๋ว
                    </button>
                    <button
                      @click="viewEventDetails(event.id)"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ดูรายละเอียด
                    </button>
                    <button
                      v-if="event.status === 'upcoming'"
                      @click="setReminder(event.id)"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ตั้งแจ้งเตือน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fighters Tab -->
          <div
            v-if="activeTab === 'fighters'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="fighter in filteredFavoriteFighters"
              :key="fighter.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="text-center">
                <div class="relative inline-block">
                  <img
                    :src="fighter.photo || '/images/default-fighter.jpg'"
                    :alt="fighter.name"
                    class="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <button
                    @click="removeFavoriteFighter(fighter.id)"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Icon icon="mdi:close" class="text-sm" />
                  </button>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-2">
                  {{ fighter.name }}
                </h3>
                <div class="flex justify-center gap-2 mb-3">
                  <span
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {{ fighter.weightClass }}
                  </span>
                  <span
                    class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                  >
                    {{ fighter.nationality }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p class="text-2xl font-bold text-green-600">
                      {{ fighter.wins }}
                    </p>
                    <p class="text-xs text-gray-600">ชนะ</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-red-600">
                      {{ fighter.losses }}
                    </p>
                    <p class="text-xs text-gray-600">แพ้</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-600">
                      {{ fighter.draws }}
                    </p>
                    <p class="text-xs text-gray-600">เสมอ</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <button
                    @click="viewFighterProfile(fighter.id)"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ดูประวัติ
                  </button>
                  <button
                    v-if="fighter.nextFight"
                    @click="viewUpcomingFight(fighter.nextFight.id)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    การแข่งขันถัดไป
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Venues Tab -->
          <div
            v-if="activeTab === 'venues'"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div
              v-for="venue in filteredFavoriteVenues"
              :key="venue.id"
              class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                :src="venue.image || '/images/default-venue.jpg'"
                :alt="venue.name"
                class="w-full h-48 object-cover"
              />

              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">
                      {{ venue.name }}
                    </h3>
                    <div class="flex items-center gap-1 text-yellow-400 mb-2">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        :icon="
                          i <= venue.rating ? 'mdi:star' : 'mdi:star-outline'
                        "
                        class="text-sm"
                      />
                      <span class="text-gray-600 text-sm ml-1"
                        >({{ venue.reviews }})</span
                      >
                    </div>
                  </div>
                  <button
                    @click="removeFavoriteVenue(venue.id)"
                    class="text-red-500 hover:text-red-700 p-2"
                  >
                    <Icon icon="mdi:heart" class="text-xl" />
                  </button>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:map-marker" class="text-lg" />
                    <span class="text-sm">{{ venue.address }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:seat" class="text-lg" />
                    <span class="text-sm"
                      >{{ venue.capacity.toLocaleString() }} ที่นั่ง</span
                    >
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <Icon icon="mdi:calendar" class="text-lg" />
                    <span class="text-sm">{{
                      venue.nextEvent?.name || "ไม่มีการแข่งขันในเร็วๆนี้"
                    }}</span>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    v-if="venue.nextEvent"
                    @click="bookTicket(venue.nextEvent.id)"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    จองตั๋ว
                  </button>
                  <button
                    @click="viewVenueDetails(venue.id)"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty States -->
          <div
            v-if="getCurrentTabItems().length === 0"
            class="text-center py-12"
          >
            <Icon
              :icon="getCurrentTabIcon()"
              class="text-6xl text-gray-400 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              ยังไม่มีรายการโปรด
            </h3>
            <p class="text-gray-600 mb-6">
              เริ่มต้นการติดตาม{{ getCurrentTabText() }}ที่คุณสนใจ
            </p>
            <button
              @click="navigateTo('/')"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              สำรวจ{{ getCurrentTabText() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Authentication check
definePageMeta({
  middleware: "auth",
});

// Reactive data
const activeTab = ref("events");
const filterCategory = ref("");

const tabs = [
  { id: "events", name: "เหตุการณ์", icon: "mdi:calendar-heart" },
  { id: "fighters", name: "นักมวย", icon: "mdi:account-heart" },
  { id: "venues", name: "สถานที่", icon: "mdi:map-marker-heart" },
];

// Mock favorite data
const favoriteEvents = ref([
  {
    id: 1,
    name: "Muay Thai Championship Night",
    date: "2024-02-20",
    time: "21:00",
    venue: "Patong Boxing Stadium",
    category: "Muay Thai",
    status: "upcoming",
    priceFrom: 1500,
    image: "/images/muay-thai-event-1.jpg",
  },
  {
    id: 2,
    name: "International Boxing Match",
    date: "2024-02-25",
    time: "20:00",
    venue: "Patong Boxing Stadium",
    category: "Boxing",
    status: "upcoming",
    priceFrom: 1800,
    image: "/images/boxing-event-1.jpg",
  },
  {
    id: 3,
    name: "Friday Fight Night",
    date: "2024-01-30",
    time: "21:00",
    venue: "Patong Boxing Stadium",
    category: "Mixed",
    status: "completed",
    priceFrom: 1200,
    image: "/images/fight-night-1.jpg",
  },
]);

const favoriteFighters = ref([
  {
    id: 1,
    name: "สมชาย เตะเก่ง",
    weightClass: "70 kg",
    nationality: "ไทย",
    wins: 25,
    losses: 3,
    draws: 1,
    photo: "/images/fighter-1.jpg",
    nextFight: { id: 1, date: "2024-02-20" },
  },
  {
    id: 2,
    name: "John Smith",
    weightClass: "75 kg",
    nationality: "USA",
    wins: 18,
    losses: 5,
    draws: 2,
    photo: "/images/fighter-2.jpg",
    nextFight: { id: 2, date: "2024-02-25" },
  },
  {
    id: 3,
    name: "ทักษิณ หมัดแรง",
    weightClass: "68 kg",
    nationality: "ไทย",
    wins: 30,
    losses: 2,
    draws: 0,
    photo: "/images/fighter-3.jpg",
    nextFight: null,
  },
]);

const favoriteVenues = ref([
  {
    id: 1,
    name: "Patong Boxing Stadium",
    address: "198/4 ถนนราชอุทิศ 200 ปี ปาตอง ภูเก็ต",
    capacity: 2000,
    rating: 4.8,
    reviews: 1250,
    image: "/images/patong-stadium.jpg",
    nextEvent: { id: 1, name: "Championship Night" },
  },
  {
    id: 2,
    name: "Bangla Boxing Stadium",
    address: "ถนนบางลา ปาตอง ภูเก็ต",
    capacity: 1500,
    rating: 4.5,
    reviews: 890,
    image: "/images/bangla-stadium.jpg",
    nextEvent: null,
  },
]);

// Computed properties
const filteredFavoriteEvents = computed(() => {
  if (!filterCategory.value || filterCategory.value === "events") {
    return favoriteEvents.value;
  }
  return [];
});

const filteredFavoriteFighters = computed(() => {
  if (!filterCategory.value || filterCategory.value === "fighters") {
    return favoriteFighters.value;
  }
  return [];
});

const filteredFavoriteVenues = computed(() => {
  if (!filterCategory.value || filterCategory.value === "venues") {
    return favoriteVenues.value;
  }
  return [];
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getEventStatusText = (status) => {
  switch (status) {
    case "upcoming":
      return "กำลังจะมาถึง";
    case "live":
      return "กำลังแข่งขัน";
    case "completed":
      return "จบแล้ว";
    case "cancelled":
      return "ยกเลิก";
    default:
      return status;
  }
};

const getEventStatusClasses = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-green-100 text-green-800";
    case "live":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCurrentTabItems = () => {
  switch (activeTab.value) {
    case "events":
      return filteredFavoriteEvents.value;
    case "fighters":
      return filteredFavoriteFighters.value;
    case "venues":
      return filteredFavoriteVenues.value;
    default:
      return [];
  }
};

const getCurrentTabIcon = () => {
  switch (activeTab.value) {
    case "events":
      return "mdi:calendar-heart-outline";
    case "fighters":
      return "mdi:account-heart-outline";
    case "venues":
      return "mdi:map-marker-heart-outline";
    default:
      return "mdi:heart-outline";
  }
};

const getCurrentTabText = () => {
  switch (activeTab.value) {
    case "events":
      return "เหตุการณ์";
    case "fighters":
      return "นักมวย";
    case "venues":
      return "สถานที่";
    default:
      return "รายการ";
  }
};

// Action methods
const removeFavoriteEvent = (eventId) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบเหตุการณ์นี้จากรายการโปรด?")) {
    const index = favoriteEvents.value.findIndex(
      (event) => event.id === eventId
    );
    if (index !== -1) {
      favoriteEvents.value.splice(index, 1);
    }
  }
};

const removeFavoriteFighter = (fighterId) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบนักมวยนี้จากรายการโปรด?")) {
    const index = favoriteFighters.value.findIndex(
      (fighter) => fighter.id === fighterId
    );
    if (index !== -1) {
      favoriteFighters.value.splice(index, 1);
    }
  }
};

const removeFavoriteVenue = (venueId) => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบสถานที่นี้จากรายการโปรด?")) {
    const index = favoriteVenues.value.findIndex(
      (venue) => venue.id === venueId
    );
    if (index !== -1) {
      favoriteVenues.value.splice(index, 1);
    }
  }
};

const clearAllFavorites = () => {
  if (confirm("คุณแน่ใจหรือไม่ที่จะลบรายการโปรดทั้งหมด?")) {
    favoriteEvents.value = [];
    favoriteFighters.value = [];
    favoriteVenues.value = [];
  }
};

const bookTicket = (eventId) => {
  navigateTo(`/events/${eventId}/booking`);
};

const viewEventDetails = (eventId) => {
  navigateTo(`/events/${eventId}`);
};

const viewFighterProfile = (fighterId) => {
  navigateTo(`/fighters/${fighterId}`);
};

const viewVenueDetails = (venueId) => {
  navigateTo(`/venues/${venueId}`);
};

const viewUpcomingFight = (fightId) => {
  navigateTo(`/fights/${fightId}`);
};

const setReminder = (eventId) => {
  alert("ตั้งแจ้งเตือนเรียบร้อยแล้ว");
};

// SEO
useSeoMeta({
  title: "My Favorites - Patong Boxing Stadium",
  description:
    "Manage your favorite events, fighters and venues at Patong Boxing Stadium",
  ogTitle: "My Favorites - Patong Boxing Stadium",
  ogDescription: "Track your favorite boxing events and fighters",
});
</script>
