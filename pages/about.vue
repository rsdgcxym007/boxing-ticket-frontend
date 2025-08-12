<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          {{ t("menu.about") }}
        </h1>

        <!-- Hero Section -->
        <div class="relative h-64 rounded-lg overflow-hidden mb-8">
          <img
            :src="getImagePath('/images/stadium/stadium-1.jpg')"
            alt="Patong Boxing Stadium"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          >
            <h2 class="text-white text-4xl font-bold">PATONG BOXING STADIUM</h2>
          </div>
        </div>

        <!-- About Content -->
        <div class="prose max-w-none">
          <p class="text-lg text-gray-700 mb-6">
            สนามมวยปาตองเป็นสนามมวยที่มีชื่อเสียงที่สุดในภูเก็ต
            ก่อตั้งขึ้นเพื่อส่งเสริมและอนุรักษ์ศิลปะการต่อสู้มวยไทยแบบดั้งเดิม
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-4">
            ประวัติความเป็นมา
          </h3>
          <p class="text-gray-700 mb-6">
            สนามมวยปาตองเปิดให้บริการมาตั้งแต่ปี 2010
            โดยมีเป้าหมายหลักคือการเป็นศูนย์กลางของการแข่งขันมวยไทยระดับโลก
            และเป็นแหล่งท่องเที่ยวทางวัฒนธรรมที่สำคัญของจังหวัดภูเก็ต
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-4">วิสัยทัศน์</h3>
          <p class="text-gray-700 mb-6">
            เป็นสนามมวยชั้นนำของประเทศไทยที่มีมาตรฐานระดับสากล
            พร้อมทั้งเป็นสะพานเชื่อมวัฒนธรรมมวยไทยสู่นักท่องเที่ยวทั่วโลก
          </p>

          <h3 class="text-2xl font-semibold text-gray-900 mb-4">
            สิ่งอำนวยความสะดวก
          </h3>
          <ul class="list-disc list-inside text-gray-700 mb-6">
            <li>สนามแข่งขันมาตรฐานสากล</li>
            <li>ที่นั่งสำหรับผู้ชม 2,000 ที่นั่ง</li>
            <li>ระบบเสียงและแสงสว่างครบครัน</li>
            <li>ห้องแต่งตัวนักมวยแยกชาย-หญิง</li>
            <li>ลานจอดรถกว้างขวาง</li>
            <li>ร้านอาหารและเครื่องดื่ม</li>
            <li>ร้านของที่ระลึก</li>
          </ul>

          <h3 class="text-2xl font-semibold text-gray-900 mb-4">การแข่งขัน</h3>
          <p class="text-gray-700 mb-6">
            จัดการแข่งขันมวยไทยทุกวันจันทร์ อังคาร พฤหัสบดี และเสาร์ เวลา 21.00
            - 23.00 น. โดยมีการแข่งขัน 6-8 คู่ต่อคืน
            พร้อมนักมวยระดับแนวหน้าจากทั่วประเทศ
          </p>

          <div class="bg-blue-50 p-6 rounded-lg">
            <h4 class="text-xl font-semibold text-blue-900 mb-3">ติดต่อเรา</h4>
            <div class="text-blue-800">
              <p>
                <strong>ที่อยู่:</strong> 198/4 ถนนราชอุทิศ 200 ปี ตำบลปาตอง
                อำเภอกะทู้ จังหวัดภูเก็ต 83150
              </p>
              <p><strong>โทรศัพท์:</strong> 076-344-222</p>
              <p><strong>อีเมล:</strong> info@patongboxing.com</p>
              <p><strong>เว็บไซต์:</strong> www.patongboxing.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useImagePath } from "@/composables/useImagePath";

const { t } = useI18n();
const { getImagePath } = useImagePath();

// SEO
useSeoMeta({
  title: "About Us - Patong Boxing Stadium",
  description:
    "Learn about Patong Boxing Stadium - Phuket's premier Muay Thai venue with world-class facilities and authentic Thai boxing matches.",
  ogTitle: "About Patong Boxing Stadium",
  ogDescription:
    "Premier Muay Thai venue in Phuket with authentic Thai boxing matches",
  ogImage: "/images/stadium/stadium-1.jpg",
});
</script>
