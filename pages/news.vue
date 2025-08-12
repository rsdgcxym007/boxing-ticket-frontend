<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          {{ t("menu.news") }}
        </h1>

        <!-- Featured News -->
        <div
          class="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg mb-8"
        >
          <div class="flex items-center gap-2 mb-3">
            <Icon icon="mdi:fire" class="text-2xl" />
            <span class="text-sm uppercase font-semibold">ข่าวเด่น</span>
          </div>
          <h2 class="text-2xl font-bold mb-2">
            ชิงแชมป์โลก WBC มวยไทยรุ่นเฟเธอร์เวท
          </h2>
          <p class="text-red-100 mb-4">
            สนามมวยปาตองเตรียมจัดการแข่งขันชิงแชมป์โลกครั้งประวัติศาสตร์ในเดือนมีนาคม
            2025
          </p>
          <button
            class="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            อ่านต่อ
          </button>
        </div>

        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- News Item 1 -->
          <article
            class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <div
              class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"
            >
              <Icon icon="mdi:trophy" class="text-6xl text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >แข่งขัน</span
                >
                <span class="text-sm text-gray-500">12 มกราคม 2025</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                นักมวยไทยคว้าแชมป์เอเชีย
              </h3>
              <p class="text-gray-600 mb-4">
                พิชญา สายมวย นักมวยจากค่ายสนามมวยปาตอง
                คว้าแชมป์เอเชียรุ่นซูเปอร์แบนตัมเวทสำเร็จ...
              </p>
              <button
                class="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                อ่านเพิ่มเติม →
              </button>
            </div>
          </article>

          <!-- News Item 2 -->
          <article
            class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <div
              class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
            >
              <Icon icon="mdi:stadium" class="text-6xl text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >สนามมวย</span
                >
                <span class="text-sm text-gray-500">10 มกราคม 2025</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                ปรับปรุงระบบเสียงใหม่
              </h3>
              <p class="text-gray-600 mb-4">
                สนามมวยปาตองพัฒนาระบบเสียงคุณภาพสูง
                เพื่อประสบการณ์การชมมวยที่ดีขึ้น...
              </p>
              <button
                class="text-green-600 font-semibold hover:text-green-800 transition"
              >
                อ่านเพิ่มเติม →
              </button>
            </div>
          </article>

          <!-- News Item 3 -->
          <article
            class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <div
              class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
            >
              <Icon icon="mdi:account-group" class="text-6xl text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                  >ฝึกอบรม</span
                >
                <span class="text-sm text-gray-500">8 มกราคม 2025</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                เปิดคอร์สมวยไทยสำหรับนักท่องเที่ยว
              </h3>
              <p class="text-gray-600 mb-4">
                ขยายบริการคอร์สเรียนมวยไทยสำหรับนักท่องเที่ยวทุกระดับ เริ่ม 15
                มกราคม...
              </p>
              <button
                class="text-purple-600 font-semibold hover:text-purple-800 transition"
              >
                อ่านเพิ่มเติม →
              </button>
            </div>
          </article>

          <!-- News Item 4 -->
          <article
            class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <div
              class="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
            >
              <Icon icon="mdi:ticket" class="text-6xl text-white" />
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                  >โปรโมชั่น</span
                >
                <span class="text-sm text-gray-500">5 มกราคม 2025</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                ลดราคาพิเศษสำหรับกลุ่ม
              </h3>
              <p class="text-gray-600 mb-4">
                ส่วนลดสูงสุด 30% สำหรับการจองตั๋วแบบกลุ่ม ตั้งแต่ 10 คนขึ้นไป...
              </p>
              <button
                class="text-orange-600 font-semibold hover:text-orange-800 transition"
              >
                อ่านเพิ่มเติม →
              </button>
            </div>
          </article>
        </div>

        <!-- Announcements -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3
            class="text-xl font-semibold text-yellow-800 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:bullhorn" class="text-2xl" />
            ประกาศสำคัญ
          </h3>
          <div class="space-y-4">
            <div class="border-l-4 border-yellow-400 pl-4">
              <h4 class="font-semibold text-yellow-900">
                เปลี่ยนแปลงตารางการแข่งขัน
              </h4>
              <p class="text-yellow-800">
                เนื่องจากเทศกาลปีใหม่ การแข่งขันวันที่ 1 มกราคม เลื่อนเป็นวันที่
                2 มกราคม
              </p>
              <p class="text-sm text-yellow-700">
                ข้อมูลเพิ่มเติม: โทร 076-344-222
              </p>
            </div>
            <div class="border-l-4 border-yellow-400 pl-4">
              <h4 class="font-semibold text-yellow-900">
                มาตรการความปลอดภัย COVID-19
              </h4>
              <p class="text-yellow-800">
                ขอความร่วมมือเว้นระยะห่างและสวมหน้ากากอนามัย ตามมาตรการของรัฐบาล
              </p>
              <p class="text-sm text-yellow-700">อัปเดตล่าสุด: 1 มกราคม 2025</p>
            </div>
          </div>
        </div>

        <!-- Subscribe Section -->
        <div class="bg-gray-50 rounded-lg p-6">
          <div class="text-center">
            <Icon
              icon="mdi:email-newsletter"
              class="text-4xl text-blue-600 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              รับข่าวสารล่าสุด
            </h3>
            <p class="text-gray-600 mb-6">
              สมัครรับข่าวสารและโปรโมชั่นพิเศษทางอีเมล
            </p>
            <div class="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                สมัคร
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";

const { t } = useI18n();

// SEO
useSeoMeta({
  title: "News & Updates - Patong Boxing Stadium",
  description:
    "Stay updated with the latest news, fight results, and announcements from Patong Boxing Stadium.",
  ogTitle: "News & Updates - Patong Boxing Stadium",
  ogDescription:
    "Latest news, fight results, and announcements from Patong Boxing Stadium",
  ogImage: "/images/news-preview.jpg",
});
</script>
