<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto py-12 px-4">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">กฎและระเบียบ</h1>

        <!-- Rules Header -->
        <div
          class="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg mb-8"
        >
          <h2 class="text-2xl font-bold mb-2">
            ข้อกำหนดและเงื่อนไขการใช้บริการ
          </h2>
          <p class="text-red-100">
            กรุณาอ่านและทำความเข้าใจกฎระเบียบก่อนเข้าชมการแข่งขัน
          </p>
        </div>

        <!-- Table of Contents -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">สารบัญ</h3>
          <ul class="space-y-2 text-blue-800">
            <li>
              <a href="#general-rules" class="hover:underline"
                >1. กฎทั่วไปของสนามมวย</a
              >
            </li>
            <li>
              <a href="#ticket-policy" class="hover:underline"
                >2. นโยบายการขายตั๋ว</a
              >
            </li>
            <li>
              <a href="#entry-rules" class="hover:underline"
                >3. กฎการเข้า-ออกสนาม</a
              >
            </li>
            <li>
              <a href="#prohibited-items" class="hover:underline"
                >4. สิ่งของต้องห้าม</a
              >
            </li>
            <li>
              <a href="#behavior-code" class="hover:underline"
                >5. จรรยาบรรณผู้ชม</a
              >
            </li>
            <li>
              <a href="#safety-rules" class="hover:underline"
                >6. มาตรการความปลอดภัย</a
              >
            </li>
            <li>
              <a href="#refund-policy" class="hover:underline"
                >7. นโยบายการคืนเงิน</a
              >
            </li>
          </ul>
        </div>

        <!-- General Rules -->
        <section id="general-rules" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:gavel" class="text-2xl text-red-600" />
            1. กฎทั่วไปของสนามมวย
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-red-400 pl-4">
              <h4 class="font-semibold mb-2">เวลาการแข่งขัน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>การแข่งขันจัดขึ้นทุกวันจันทร์ อังคาร พฤหัสบดี และเสาร์</li>
                <li>เวลา 21.00 - 23.00 น. (เปิดประตู 20.00 น.)</li>
                <li>
                  ขอสงวนสิทธิ์ในการเปลี่ยนแปลงตารางการแข่งขันโดยไม่แจ้งให้ทราบล่วงหน้า
                </li>
              </ul>
            </div>
            <div class="border-l-4 border-red-400 pl-4">
              <h4 class="font-semibold mb-2">การเข้าชมการแข่งขัน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ผู้ชมต้องมีตั๋วที่ถูกต้องและไม่หมดอายุ</li>
                <li>เด็กอายุต่ำกว่า 12 ปี ต้องมีผู้ปกครองดูแล</li>
                <li>ห้ามนำอาหาร เครื่องดื่มแอลกอฮอล์ และสารเสพติดเข้าสนาม</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Ticket Policy -->
        <section id="ticket-policy" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:ticket" class="text-2xl text-green-600" />
            2. นโยบายการขายตั๋ว
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-green-400 pl-4">
              <h4 class="font-semibold mb-2">การจองและชำระเงิน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>สามารถจองตั๋วล่วงหน้าได้สูงสุด 30 วัน</li>
                <li>ต้องชำระเงินภายใน 30 นาทีหลังจากการจอง</li>
                <li>รับชำระด้วยบัตรเครดิต เดบิต และ QR Code</li>
              </ul>
            </div>
            <div class="border-l-4 border-green-400 pl-4">
              <h4 class="font-semibold mb-2">ประเภทตั๋วและราคา</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ตั๋วริงไซด์: 1,800 บาท (รวมเสื้อยืดฟรี)</li>
                <li>ตั๋วสแตนด์: 1,500 บาท (รวมเสื้อยืดฟรี)</li>
                <li>ส่วนลดกลุ่ม: 10% สำหรับ 10 คนขึ้นไป</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Entry Rules -->
        <section id="entry-rules" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:door-open" class="text-2xl text-blue-600" />
            3. กฎการเข้า-ออกสนาม
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-blue-400 pl-4">
              <h4 class="font-semibold mb-2">การเข้าสนาม</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>แสดงตั๋วและบัตรประชาชนเมื่อเข้าสนาม</li>
                <li>ผ่านการตรวจค้นเพื่อความปลอดภัย</li>
                <li>ห้ามเข้าสนามหลังเริ่มการแข่งขันแล้ว 30 นาที</li>
              </ul>
            </div>
            <div class="border-l-4 border-blue-400 pl-4">
              <h4 class="font-semibold mb-2">การออกจากสนาม</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ห้ามเข้า-ออกระหว่างการแข่งขันในแต่ละยก</li>
                <li>สามารถออกได้ในช่วงพักระหว่างคู่</li>
                <li>ห้ามนำของจากภายในสนามออกไป (ยกเว้นของส่วนตัว)</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Prohibited Items -->
        <section id="prohibited-items" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:cancel" class="text-2xl text-red-600" />
            4. สิ่งของต้องห้าม
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-semibold text-red-900 mb-3">ห้ามนำเข้าสนาม</h4>
              <ul class="list-disc list-inside space-y-1 text-red-800 text-sm">
                <li>อาวุธทุกประเภท</li>
                <li>สารเสพติดและเครื่องดื่มแอลกอฮอล์</li>
                <li>อาหารและเครื่องดื่มจากภายนอก</li>
                <li>กล้องถ่ายรูปแบบมืออาชีพ</li>
                <li>เครื่องบันทึกเสียงและวิดีโอ</li>
                <li>ป้าย แผ่นพับ โฆษณา</li>
                <li>สัตว์เลี้ยง (ยกเว้นสุนัขนำทาง)</li>
              </ul>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-3">อนุญาตให้นำเข้า</h4>
              <ul
                class="list-disc list-inside space-y-1 text-green-800 text-sm"
              >
                <li>โทรศัพท์มือถือ</li>
                <li>กล้องถ่ายรูปขนาดเล็ก</li>
                <li>กระเป๋าส่วนตัวขนาดเล็ก</li>
                <li>ยาส่วนตัวที่จำเป็น</li>
                <li>เสื้อผ้าเปลี่ยน</li>
                <li>ร่ม (กรณีฝนตก)</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Behavior Code -->
        <section id="behavior-code" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:account-heart" class="text-2xl text-purple-600" />
            5. จรรยาบรรณผู้ชม
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-purple-400 pl-4">
              <h4 class="font-semibold mb-2">พึงปฏิบัติ</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>เชียร์อย่างสุภาพและให้กำลังใจนักมวย</li>
                <li>ยืนตอนเพลงชาติและไหว้ธงชาติ</li>
                <li>ให้ความเคารพต่อพิธีไหว้ครูมวยไทย</li>
                <li>รักษาความสะอาดและความเป็นระเบียบ</li>
              </ul>
            </div>
            <div class="border-l-4 border-purple-400 pl-4">
              <h4 class="font-semibold mb-2">ไม่พึงปฏิบัติ</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ใช้คำหยาบคายหรือสร้างความรำคาญ</li>
                <li>โยนของหรือขว้างสิ่งของลงริง</li>
                <li>ก้าวร้าวหรือทำร้ายผู้อื่น</li>
                <li>การพนันในรูปแบบใดๆ</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Safety Rules -->
        <section id="safety-rules" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:shield-check" class="text-2xl text-orange-600" />
            6. มาตรการความปลอดภัย
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-orange-400 pl-4">
              <h4 class="font-semibold mb-2">ความปลอดภัยทั่วไป</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>มีเจ้าหน้าที่รักษาความปลอดภัยตลอดเวลา</li>
                <li>ระบบกล้องวงจรปิดครอบคลุมทุกพื้นที่</li>
                <li>ทางออกฉุกเฉินมีไฟส่องสว่างและป้ายบอกทาง</li>
                <li>มีแพทย์และพยาบาลประจำสนาม</li>
              </ul>
            </div>
            <div class="border-l-4 border-orange-400 pl-4">
              <h4 class="font-semibold mb-2">กรณีฉุกเฉิน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ปฏิบัติตามคำแนะนำของเจ้าหน้าที่</li>
                <li>ไม่วิ่งหรือแสดงท่าทางตื่นตระหนก</li>
                <li>ใช้ทางออกฉุกเฉินที่ใกล้ที่สุด</li>
                <li>ติดต่อเจ้าหน้าที่: โทร 076-344-222</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Refund Policy -->
        <section id="refund-policy" class="mb-8">
          <h3
            class="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
          >
            <Icon icon="mdi:cash-refund" class="text-2xl text-indigo-600" />
            7. นโยบายการคืนเงิน
          </h3>
          <div class="space-y-4 text-gray-700">
            <div class="border-l-4 border-indigo-400 pl-4">
              <h4 class="font-semibold mb-2">เงื่อนไขการคืนเงิน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ยกเลิกล่วงหน้า 24 ชั่วโมง: คืนเงิน 100%</li>
                <li>ยกเลิกล่วงหน้า 12 ชั่วโมง: คืนเงิน 50%</li>
                <li>ยกเลิกล่วงหน้าน้อยกว่า 12 ชั่วโมง: ไม่คืนเงิน</li>
                <li>กรณีสนามยกเลิกการแข่งขัน: คืนเงิน 100%</li>
              </ul>
            </div>
            <div class="border-l-4 border-indigo-400 pl-4">
              <h4 class="font-semibold mb-2">วิธีการขอคืนเงิน</h4>
              <ul class="list-disc list-inside space-y-1">
                <li>ติดต่อฝ่ายลูกค้าสัมพันธ์ โทร 076-344-222</li>
                <li>แจ้งรหัสการจองและเหตุผลในการยกเลิก</li>
                <li>กระบวนการคืนเงินใช้เวลา 7-14 วันทำการ</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Contact Information -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">ข้อมูลติดต่อ</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <h4 class="font-semibold mb-2">สนามมวยปาตอง</h4>
              <p class="text-sm">198/4 ถนนราชอุทิศ 200 ปี</p>
              <p class="text-sm">ตำบลปาตอง อำเภอกะทู้</p>
              <p class="text-sm">จังหวัดภูเก็ต 83150</p>
            </div>
            <div>
              <h4 class="font-semibold mb-2">ช่องทางติดต่อ</h4>
              <p class="text-sm">โทรศัพท์: 076-344-222</p>
              <p class="text-sm">อีเมล: info@patongboxing.com</p>
              <p class="text-sm">เว็บไซต์: www.patongboxing.com</p>
            </div>
          </div>

          <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p class="text-sm text-yellow-800">
              <Icon icon="mdi:information" class="inline mr-1" />
              กฎและระเบียบนี้อาจมีการเปลี่ยนแปลงโดยไม่แจ้งให้ทราบล่วงหน้า
              กรุณาตรวจสอบข้อมูลล่าสุดก่อนเดินทางมาสนามมวย
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// SEO
useSeoMeta({
  title: "Rules & Regulations - Patong Boxing Stadium",
  description:
    "Read the complete rules and regulations for attending fights at Patong Boxing Stadium. Includes ticket policies, entry rules and safety guidelines.",
  ogTitle: "Rules & Regulations - Patong Boxing Stadium",
  ogDescription:
    "Complete rules and regulations for attending Muay Thai fights at Patong Boxing Stadium",
  ogImage: "/images/rules-preview.jpg",
});
</script>
