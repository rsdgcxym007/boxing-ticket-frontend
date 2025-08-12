<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">แกลลอรี่</h1>

        <!-- Gallery Header -->
        <div
          class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg mb-8"
        >
          <h2 class="text-2xl font-bold mb-2">ภาพบรรยากาศสนามมวยปาตอง</h2>
          <p class="text-purple-100">
            รวมภาพการแข่งขัน ความมันส์ และบรรยากาศดีๆ จากสนามมวยปาตอง
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="category in galleryCategories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition',
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(image, index) in filteredImages"
            :key="index"
            @click="openLightbox(image, index)"
            class="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <div
              class="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-300 to-gray-400"
            >
              <div class="flex items-center justify-center h-64">
                <div class="text-center text-gray-600">
                  <Icon :icon="image.icon" class="text-6xl mb-2" />
                  <p class="text-sm">{{ image.title }}</p>
                </div>
              </div>
            </div>

            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center"
            >
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center"
              >
                <Icon icon="mdi:magnify" class="text-4xl mb-2" />
                <p class="text-sm font-medium">{{ image.title }}</p>
                <p class="text-xs text-gray-300">{{ image.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div class="text-center mt-8">
          <button
            @click="loadMore"
            v-if="!allLoaded"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ดูภาพเพิ่มเติม
          </button>
        </div>

        <!-- Lightbox Modal -->
        <div
          v-if="lightboxOpen"
          @click="closeLightbox"
          class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        >
          <div class="relative max-w-4xl max-h-full">
            <!-- Close Button -->
            <button
              @click="closeLightbox"
              class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <Icon icon="mdi:close" class="text-3xl" />
            </button>

            <!-- Navigation Arrows -->
            <button
              @click.stop="previousImage"
              v-if="currentImageIndex > 0"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <Icon icon="mdi:chevron-left" class="text-4xl" />
            </button>

            <button
              @click.stop="nextImage"
              v-if="currentImageIndex < filteredImages.length - 1"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <Icon icon="mdi:chevron-right" class="text-4xl" />
            </button>

            <!-- Image -->
            <div class="bg-white rounded-lg p-8 max-h-full overflow-auto">
              <div
                class="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-4"
              >
                <div class="flex items-center justify-center h-96">
                  <div class="text-center text-gray-600">
                    <Icon :icon="selectedImage.icon" class="text-8xl mb-4" />
                    <p class="text-lg">{{ selectedImage.title }}</p>
                  </div>
                </div>
              </div>

              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ selectedImage.title }}
                </h3>
                <p class="text-gray-600 mb-2">
                  {{ selectedImage.description }}
                </p>
                <p class="text-sm text-gray-500">{{ selectedImage.date }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Section -->
        <div class="mt-12">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">
            วิดีโอไฮไลท์
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="video in videos"
              :key="video.id"
              class="bg-gray-100 rounded-lg p-6 hover:shadow-md transition"
            >
              <div
                class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-lg mb-4"
              >
                <div class="flex items-center justify-center">
                  <Icon icon="mdi:play-circle" class="text-6xl text-white" />
                </div>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">
                {{ video.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">{{ video.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ video.date }}</span>
                <button
                  class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                >
                  ดูวิดีโอ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";

// Gallery data
const selectedCategory = ref("all");
const lightboxOpen = ref(false);
const selectedImage = ref(null);
const currentImageIndex = ref(0);
const displayCount = ref(12);
const allLoaded = ref(false);

const galleryCategories = [
  { id: "all", name: "ทั้งหมด" },
  { id: "fights", name: "การแข่งขัน" },
  { id: "ceremony", name: "พิธีกรรม" },
  { id: "training", name: "การฝึกซ้อม" },
  { id: "stadium", name: "สนามมวย" },
  { id: "audience", name: "ผู้ชม" },
];

const galleryImages = [
  {
    id: 1,
    title: "การแข่งขันมวยไทยแชมเปียน",
    description: "ไฮไลท์การแข่งขันชิงแชมป์ประจำเดือน มีนักมวยชั้นนำมาแข่งขัน",
    category: "fights",
    date: "15 มกราคม 2025",
    icon: "mdi:boxing-glove",
  },
  {
    id: 2,
    title: "พิธีไหว้ครูมวยไทย",
    description:
      "พิธีไหว้ครูแบบดั้งเดิมก่อนการแข่งขัน แสดงถึงความเคารพต่อศิลปะมวยไทย",
    category: "ceremony",
    date: "12 มกราคม 2025",
    icon: "mdi:meditation",
  },
  {
    id: 3,
    title: "การฝึกซ้อมของนักมวย",
    description: "บรรยากาศการฝึกซ้อมของนักมวยรุ่นเยาว์ในค่ายมวย",
    category: "training",
    date: "10 มกราคม 2025",
    icon: "mdi:dumbbell",
  },
  {
    id: 4,
    title: "สนามมวยปาตองยามค่ำ",
    description: "บรรยากาศสนามมวยในยามค่ำคืน เต็มไปด้วยแสงไฟและเสียงเชียร์",
    category: "stadium",
    date: "8 มกราคม 2025",
    icon: "mdi:stadium",
  },
  {
    id: 5,
    title: "ผู้ชมเชียร์กันสนั่น",
    description: "ความตื่นเต้นของผู้ชมในการแข่งขันสุดมันส์",
    category: "audience",
    date: "5 มกราคม 2025",
    icon: "mdi:account-group",
  },
  {
    id: 6,
    title: "นักมวยสาวแชมเปียน",
    description: "นางฟ้ามวยไทย แชมเปียนสาวรุ่นเฟเธอร์เวท",
    category: "fights",
    date: "3 มกราคม 2025",
    icon: "mdi:trophy",
  },
  {
    id: 7,
    title: "การแสดงรำมวย",
    description: "การแสดงรำมวยแบบดั้งเดิมก่อนการแข่งขัน",
    category: "ceremony",
    date: "1 มกราคม 2025",
    icon: "mdi:music",
  },
  {
    id: 8,
    title: "ครูฝึกมวยไทย",
    description: "ครูฝึกที่มีประสบการณ์กว่า 20 ปี สอนเด็กรุ่นใหม่",
    category: "training",
    date: "28 ธันวาคม 2024",
    icon: "mdi:school",
  },
];

const videos = [
  {
    id: 1,
    title: "ไฮไลท์การแข่งขันประจำสัปดาห์",
    description: "รวมไฮไลท์การแข่งขันมวยไทยสุดมันส์จากสัปดาห์ที่ผ่านมา",
    date: "15 มกราคม 2025",
  },
  {
    id: 2,
    title: "สารคดีสนามมวยปาตอง",
    description: "เรื่องราวและประวัติของสนามมวยปาตอง จากอดีตสู่ปัจจุบัน",
    date: "10 มกราคม 2025",
  },
];

const filteredImages = computed(() => {
  let images =
    selectedCategory.value === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory.value);

  return images.slice(0, displayCount.value);
});

const openLightbox = (image, index) => {
  selectedImage.value = image;
  currentImageIndex.value = index;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  selectedImage.value = null;
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    selectedImage.value = filteredImages.value[currentImageIndex.value];
  }
};

const nextImage = () => {
  if (currentImageIndex.value < filteredImages.value.length - 1) {
    currentImageIndex.value++;
    selectedImage.value = filteredImages.value[currentImageIndex.value];
  }
};

const loadMore = () => {
  displayCount.value += 6;
  if (displayCount.value >= galleryImages.length) {
    allLoaded.value = true;
  }
};

// SEO
useSeoMeta({
  title: "Gallery - Patong Boxing Stadium",
  description:
    "Photo gallery showcasing the best moments from Patong Boxing Stadium - fights, ceremonies, training and stadium atmosphere.",
  ogTitle: "Gallery - Patong Boxing Stadium",
  ogDescription:
    "Photo gallery of Muay Thai fights, ceremonies and stadium atmosphere",
  ogImage: "/images/gallery-preview.jpg",
});
</script>
