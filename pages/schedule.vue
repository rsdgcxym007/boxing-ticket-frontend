<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          {{ t("menu.schedule") }}
        </h1>

        <!-- Schedule Header -->
        <div
          class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-8"
        >
          <h2 class="text-2xl font-bold mb-2">ตารางการแข่งขันประจำสัปดาห์</h2>
          <p class="text-blue-100">
            ทุกวันจันทร์ อังคาร พฤหัสบดี และเสาร์ เวลา 21.00 - 23.00 น.
          </p>
        </div>

        <!-- Current Week Schedule -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Monday -->
          <div
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">วันจันทร์</h3>
              <Icon icon="mdi:calendar" class="text-2xl text-blue-600" />
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>เวลา:</strong> 21.00 - 23.00 น.</p>
              <p><strong>จำนวนคู่:</strong> 6-8 คู่</p>
              <p><strong>ราคาตั๋ว:</strong> 1,500 - 1,800 บาท</p>
            </div>
            <div class="mt-4">
              <span
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >เปิดขาย</span
              >
            </div>
          </div>

          <!-- Tuesday -->
          <div
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">วันอังคาร</h3>
              <Icon icon="mdi:calendar" class="text-2xl text-blue-600" />
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>เวลา:</strong> 21.00 - 23.00 น.</p>
              <p><strong>จำนวนคู่:</strong> 6-8 คู่</p>
              <p><strong>ราคาตั๋ว:</strong> 1,500 - 1,800 บาท</p>
            </div>
            <div class="mt-4">
              <span
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >เปิดขาย</span
              >
            </div>
          </div>

          <!-- Wednesday (Closed) -->
          <div class="border border-gray-200 rounded-lg p-6 opacity-50">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">วันพุธ</h3>
              <Icon icon="mdi:calendar-remove" class="text-2xl text-gray-400" />
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>สถานะ:</strong> ปิดทำการ</p>
              <p><strong>หมายเหตุ:</strong> วันพักของนักมวย</p>
            </div>
            <div class="mt-4">
              <span
                class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                >ปิด</span
              >
            </div>
          </div>

          <!-- Thursday -->
          <div
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">วันพฤหัสบดี</h3>
              <Icon icon="mdi:calendar" class="text-2xl text-blue-600" />
            </div>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>เวลา:</strong> 21.00 - 23.00 น.</p>
              <p><strong>จำนวนคู่:</strong> 6-8 คู่</p>
              <p><strong>ราคาตั๋ว:</strong> 1,500 - 1,800 บาท</p>
            </div>
            <div class="mt-4">
              <span
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >เปิดขาย</span
              >
            </div>
          </div>
        </div>

        <!-- Special Events -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3
            class="text-xl font-semibold text-yellow-800 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:star" class="text-2xl" />
            การแข่งขันพิเศษ
          </h3>
          <div class="space-y-4">
            <div class="border-l-4 border-yellow-400 pl-4">
              <h4 class="font-semibold text-yellow-900">ชิงแชมป์ประจำเดือน</h4>
              <p class="text-yellow-800">
                วันเสาร์ที่ 3 ของทุกเดือน - การแข่งขันพิเศษ 10 คู่
              </p>
              <p class="text-sm text-yellow-700">
                ราคาตั๋วพิเศษ: 2,000 - 2,500 บาท
              </p>
            </div>
            <div class="border-l-4 border-yellow-400 pl-4">
              <h4 class="font-semibold text-yellow-900">มวยสากล vs มวยไทย</h4>
              <p class="text-yellow-800">
                วันเสาร์ที่ 4 ของทุกเดือน - การแข่งขันแบบผสม
              </p>
              <p class="text-sm text-yellow-700">
                ราคาตั๋วพิเศษ: 2,200 - 2,800 บาท
              </p>
            </div>
          </div>
        </div>

        <!-- Upcoming Matches -->
        <div class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">
            การแข่งขันที่จะมาถึง
          </h3>
          <div class="space-y-4">
            <div
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div
                class="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-2">
                    <span
                      class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >วันจันทร์</span
                    >
                    <span class="text-lg font-semibold">15 มกราคม 2025</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 mb-2">
                    คืนแห่งแชมเปียน
                  </h4>
                  <p class="text-gray-600">
                    นักมวยระดับโลก 8 คู่ พร้อมการแสดงแบบดั้งเดิม
                  </p>
                </div>
                <div class="mt-4 md:mt-0 md:ml-6">
                  <NuxtLink
                    to="/StandingTicketForm"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    จองตั๋ว
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div
                class="flex flex-col md:flex-row md:items-center justify-between"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-2">
                    <span
                      class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >วันอังคาร</span
                    >
                    <span class="text-lg font-semibold">16 มกราคม 2025</span>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 mb-2">
                    มวยดาวรุ่ง
                  </h4>
                  <p class="text-gray-600">
                    นักมวยรุ่นใหม่แสดงศักยภาพ 6 คู่สุดมันส์
                  </p>
                </div>
                <div class="mt-4 md:mt-0 md:ml-6">
                  <NuxtLink
                    to="/StandingTicketForm"
                    class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    จองตั๋ว
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rules & Guidelines -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            หมายเหตุสำคัญ
          </h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <Icon icon="mdi:check-circle" class="text-green-600 mt-0.5" />
              <span>เปิดประตูล่วงหน้า 1 ชั่วโมงก่อนการแข่งขัน</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:check-circle" class="text-green-600 mt-0.5" />
              <span>รวมเสื้อยืดฟรีสำหรับผู้ซื้อตั๋วทุกใบ</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:check-circle" class="text-green-600 mt-0.5" />
              <span>มีบริการลานจอดรถฟรี</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:check-circle" class="text-green-600 mt-0.5" />
              <span>ห้ามนำอาหารและเครื่องดื่มจากภายนอกเข้ามา</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="mdi:check-circle" class="text-green-600 mt-0.5" />
              <span>สามารถยกเลิกและคืนเงินได้ล่วงหน้า 24 ชั่วโมง</span>
            </li>
          </ul>
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
  title: "Fight Schedule - Patong Boxing Stadium",
  description:
    "Check the latest Muay Thai fight schedule at Patong Boxing Stadium. Matches every Monday, Tuesday, Thursday and Saturday.",
  ogTitle: "Fight Schedule - Patong Boxing Stadium",
  ogDescription:
    "Latest Muay Thai fight schedule - matches every Monday, Tuesday, Thursday and Saturday",
  ogImage: "/images/schedule-preview.jpg",
});
</script>
