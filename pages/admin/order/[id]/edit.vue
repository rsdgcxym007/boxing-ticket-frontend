<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-blue-900"
  >
    <div class="max-w-6xl mx-auto p-4 space-y-4">
      <!-- Header -->
      <div
        class="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 border border-blue-200"
      >
        <div class="flex items-center gap-3">
          <button
            @click="$router.go(-1)"
            class="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors text-sm"
          >
            <i class="mdi mdi-arrow-left text-blue-500"></i>
            กลับ
          </button>
          <div>
            <h1 class="text-xl font-bold text-blue-900">
              แก้ไขออเดอร์ {{ orderData?.orderNumber }}
            </h1>
            <p class="text-sm text-blue-700">
              {{ getTicketTypeConfig(orderData?.ticketType).label }} •
              {{ getPurchaseTypeConfig(orderData?.purchaseType).label }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Use dynamic class and icon from config for each status -->
          <span
            :class="
              'px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-sm ' +
              getStatusConfig(orderData?.status).class
            "
          >
            <i :class="'mdi ' + getStatusConfig(orderData?.status).icon"></i>
            <span class="tracking-wide">{{
              getStatusConfig(orderData?.status).label
            }}</span>
          </span>
          <span
            :class="
              'px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-sm ' +
              getPaymentStatusConfig(orderData?.paymentStatus).class
            "
          >
            <i
              :class="
                'mdi ' + getPaymentStatusConfig(orderData?.paymentStatus).icon
              "
            ></i>
            <span class="tracking-wide">{{
              getPaymentStatusConfig(orderData?.paymentStatus).label
            }}</span>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <BaseLoading :visible="loading" />
      </div>

      <!-- Order Details -->
      <div v-else-if="orderData" class="space-y-4">
        <!-- Summary Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Order Summary -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i
                class="mdi mdi-ticket-confirmation-outline text-blue-500 text-lg"
              ></i>
              <h3 class="font-semibold text-blue-900">ข้อมูลออเดอร์</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">ประเภทตั๋ว:</span>
                <span class="font-medium text-blue-900">{{
                  getTicketTypeConfig(orderData.ticketType).label
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">จำนวน:</span>
                <span class="font-medium text-blue-900"
                  >{{ orderData.quantity }} ที่นั่ง</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">ราคารวม:</span>
                <span class="font-bold text-blue-700">{{
                  formatCurrency(orderData.totalAmount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i class="mdi mdi-credit-card text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">การชำระเงิน</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">วิธีชำระ:</span>
                <span class="font-medium text-blue-900">{{
                  orderData.paymentMethod
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">รับชำระโดย:</span>
                <span class="font-medium text-blue-900">{{
                  orderData.paidByName || "ยังไม่ชำระ"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">ยอดเงินออเดอร์:</span>
                <span class="font-bold text-blue-900">{{
                  formatCurrency(orderData.totalAmount)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">ยอดเงินที่จ่าย:</span>
                <span class="font-bold text-green-600">{{
                  formatCurrency(
                    orderData.paymentAmount || orderData.totalAmount
                  )
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">วันที่แสดง:</span>
                <span class="font-medium text-blue-900">{{
                  orderData.showDate
                    ? formatThaiDate(orderData.showDate)
                    : "ไม่มีข้อมูล"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i class="mdi mdi-clock-outline text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">เวลาดำเนินการ</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div>
                <span class="text-blue-700">สร้างเมื่อ:</span>
                <div class="font-medium text-blue-900">
                  {{ formatDateTime(orderData.createdAt) }}
                </div>
                <div class="text-xs text-blue-700">
                  โดย {{ orderData.createdByName }}
                </div>
              </div>
              <div v-if="orderData.updatedAt !== orderData.createdAt">
                <span class="text-blue-700">อัปเดตล่าสุด:</span>
                <div class="font-medium text-blue-900">
                  {{ formatDateTime(orderData.updatedAt) }}
                </div>
                <div class="text-xs text-blue-700">
                  โดย {{ orderData.lastUpdatedByName || orderData.paidByName }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information (if not ONSITE) -->
        <div
          v-if="shouldShowCustomerSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-account text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ข้อมูลลูกค้า</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >ชื่อ</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerName')"
                class="text-blue-900 py-2"
              >
                {{ orderData.customerName || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerName"
                placeholder="กรอกชื่อลูกค้า"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >เบอร์โทร</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerPhone')"
                class="text-blue-900 py-2 font-mono"
              >
                {{ orderData.customerPhone || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerPhone"
                placeholder="กรอกเบอร์โทร"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >อีเมล</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerEmail')"
                class="text-blue-900 py-2 font-mono text-sm break-all"
              >
                {{ orderData.email || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerEmail"
                placeholder="กรอกอีเมล"
                type="email"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
          </div>
        </div>

        <!-- Referrer Information -->
        <div
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-handshake text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ข้อมูลการแนะนำ</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >ผู้แนะนำ</label
              >
              <div
                v-if="!canEditField(orderData, 'newReferrerCode')"
                class="text-blue-900 py-2"
              >
                {{
                  orderData.referrer?.name
                    ? `${orderData.referrer.code} - ${orderData.referrer.name}`
                    : "ไม่มีข้อมูล"
                }}
              </div>
              <BaseSelect
                v-else
                v-model="formData.newReferrerCode"
                :options="masterData || []"
                placeholder="เลือกผู้แนะนำ"
                class="bg-blue-50 border-blue-200 text-blue-900 w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >ค่าคอมมิชชั่น</label
              >
              <div class="text-blue-900 py-2">
                {{
                  orderData.ticketType === TicketType.RINGSIDE
                    ? orderData.referrerCommission
                    : orderData.standingCommission || 0
                }}
                บาท
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >แหล่งที่มา</label
              >
              <div
                v-if="!canEditField(orderData, 'newSource')"
                class="text-blue-900 py-2"
              >
                {{ orderData.source }}
              </div>
              <BaseSelect
                v-else
                v-model="formData.newSource"
                :options="sourceOptions"
                class="bg-blue-50 border-blue-200 text-blue-900 w-full"
              />
            </div>
          </div>
        </div>

        <!-- Hotel & Transportation Information -->
        <div
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-bed text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ข้อมูลโรงแรมและการขนส่ง</h3>
          </div>

          <!-- Hotel Information -->
          <div class="mb-6">
            <h4 class="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <i class="mdi mdi-domain text-blue-600"></i>
              ข้อมูลโรงแรม
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >ชื่อโรงแรม</label
                >
                <div
                  v-if="!canEditField(orderData, 'hotelName')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.hotelName || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.hotelName"
                  placeholder="กรอกชื่อโรงแรม"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >เขต/อำเภอ</label
                >
                <div
                  v-if="!canEditField(orderData, 'hotelDistrict')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.hotelDistrict || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.hotelDistrict"
                  placeholder="กรอกเขต/อำเภอ"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >หมายเลขห้อง</label
                >
                <div
                  v-if="!canEditField(orderData, 'roomNumber')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.roomNumber || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.roomNumber"
                  placeholder="กรอกหมายเลขห้อง"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
            </div>
          </div>

          <!-- Passenger Information -->
          <div class="mb-6">
            <h4 class="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <i class="mdi mdi-account-group text-blue-600"></i>
              จำนวนผู้โดยสาร
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >ผู้ใหญ่</label
                >
                <div
                  v-if="!canEditField(orderData, 'adultCount')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.adultCount || 0 }} คน
                </div>
                <BaseInput
                  v-else
                  v-model.number="formData.adultCount"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >เด็ก</label
                >
                <div
                  v-if="!canEditField(orderData, 'childCount')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.childCount || 0 }} คน
                </div>
                <BaseInput
                  v-else
                  v-model.number="formData.childCount"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >ทารก</label
                >
                <div
                  v-if="!canEditField(orderData, 'infantCount')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.infantCount || 0 }} คน
                </div>
                <BaseInput
                  v-else
                  v-model.number="formData.infantCount"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >ชื่อผู้จอง</label
                >
                <div
                  v-if="!canEditField(orderData, 'bookerName')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.bookerName || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.bookerName"
                  placeholder="กรอกชื่อผู้จอง"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
            </div>
          </div>

          <!-- Voucher Information -->
          <div class="mb-6">
            <h4 class="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <i class="mdi mdi-ticket text-blue-600"></i>
              ข้อมูลบัตรกำนัล
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >หมายเลขบัตรกำนัล</label
                >
                <div
                  v-if="!canEditField(orderData, 'voucherNumber')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.voucherNumber || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.voucherNumber"
                  placeholder="กรอกหมายเลขบัตรกำนัล"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >รหัสบัตรกำนัล</label
                >
                <div
                  v-if="!canEditField(orderData, 'voucherCode')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.voucherCode || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.voucherCode"
                  placeholder="กรอกรหัสบัตรกำนัล"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1"
                  >หมายเลขอ้างอิง</label
                >
                <div
                  v-if="!canEditField(orderData, 'referenceNo')"
                  class="text-blue-900 py-2"
                >
                  {{ orderData.referenceNo || "-" }}
                </div>
                <BaseInput
                  v-else
                  v-model="formData.referenceNo"
                  placeholder="กรอกหมายเลขอ้างอิง"
                  class="bg-blue-50 border-blue-200 text-blue-900"
                />
              </div>
            </div>
          </div>

          <!-- Transportation Information -->
          <div class="mb-6">
            <h4 class="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <i class="mdi mdi-car text-blue-600"></i>
              ข้อมูลการขนส่ง
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Pickup Information -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-medium text-blue-700 mb-3">การรับ (Pickup)</h5>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div
                      v-if="!canEditField(orderData, 'includesPickup')"
                      class="text-blue-900 py-1"
                    >
                      รวมการรับ: {{ orderData.includesPickup ? "ใช่" : "ไม่" }}
                    </div>
                    <label v-else class="flex items-center gap-2 text-blue-700">
                      <input
                        type="checkbox"
                        v-model="formData.includesPickup"
                        class="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      รวมการรับ
                    </label>
                  </div>
                  <div class="flex items-center gap-3">
                    <div
                      v-if="!canEditField(orderData, 'requiresPickup')"
                      class="text-blue-900 py-1"
                    >
                      จำเป็นต้องรับ:
                      {{ orderData.requiresPickup ? "ใช่" : "ไม่" }}
                    </div>
                    <label v-else class="flex items-center gap-2 text-blue-700">
                      <input
                        type="checkbox"
                        v-model="formData.requiresPickup"
                        class="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      จำเป็นต้องรับ
                    </label>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1"
                      >เวลารับตามกำหนด</label
                    >
                    <div
                      v-if="!canEditField(orderData, 'pickupScheduledTime')"
                      class="text-blue-900 py-2"
                    >
                      {{ orderData.pickupScheduledTime || "-" }}
                    </div>
                    <BaseInput
                      v-else
                      v-model="formData.pickupScheduledTime"
                      type="time"
                      class="bg-white border-blue-200 text-blue-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1"
                      >โรงแรมที่รับ</label
                    >
                    <div
                      v-if="!canEditField(orderData, 'pickupHotel')"
                      class="text-blue-900 py-2"
                    >
                      {{ orderData.pickupHotel || "-" }}
                    </div>
                    <BaseInput
                      v-else
                      v-model="formData.pickupHotel"
                      placeholder="กรอกโรงแรมที่รับ"
                      class="bg-white border-blue-200 text-blue-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1"
                      >เวลารับจริง</label
                    >
                    <div
                      v-if="!canEditField(orderData, 'pickupTime')"
                      class="text-blue-900 py-2"
                    >
                      {{ orderData.pickupTime || "-" }}
                    </div>
                    <BaseInput
                      v-else
                      v-model="formData.pickupTime"
                      type="time"
                      class="bg-white border-blue-200 text-blue-900"
                    />
                  </div>
                </div>
              </div>

              <!-- Dropoff Information -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-medium text-blue-700 mb-3">การส่ง (Dropoff)</h5>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div
                      v-if="!canEditField(orderData, 'includesDropoff')"
                      class="text-blue-900 py-1"
                    >
                      รวมการส่ง: {{ orderData.includesDropoff ? "ใช่" : "ไม่" }}
                    </div>
                    <label v-else class="flex items-center gap-2 text-blue-700">
                      <input
                        type="checkbox"
                        v-model="formData.includesDropoff"
                        class="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      รวมการส่ง
                    </label>
                  </div>
                  <div class="flex items-center gap-3">
                    <div
                      v-if="!canEditField(orderData, 'requiresDropoff')"
                      class="text-blue-900 py-1"
                    >
                      จำเป็นต้องส่ง:
                      {{ orderData.requiresDropoff ? "ใช่" : "ไม่" }}
                    </div>
                    <label v-else class="flex items-center gap-2 text-blue-700">
                      <input
                        type="checkbox"
                        v-model="formData.requiresDropoff"
                        class="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      จำเป็นต้องส่ง
                    </label>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1"
                      >สถานที่ส่ง</label
                    >
                    <div
                      v-if="!canEditField(orderData, 'dropoffLocation')"
                      class="text-blue-900 py-2"
                    >
                      {{ orderData.dropoffLocation || "-" }}
                    </div>
                    <BaseInput
                      v-else
                      v-model="formData.dropoffLocation"
                      placeholder="กรอกสถานที่ส่ง"
                      class="bg-white border-blue-200 text-blue-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1"
                      >เวลาส่งจริง</label
                    >
                    <div
                      v-if="!canEditField(orderData, 'dropoffTime')"
                      class="text-blue-900 py-2"
                    >
                      {{ orderData.dropoffTime || "-" }}
                    </div>
                    <BaseInput
                      v-else
                      v-model="formData.dropoffTime"
                      type="time"
                      class="bg-white border-blue-200 text-blue-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div>
            <h4 class="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <i class="mdi mdi-note-text text-blue-600"></i>
              คำขอพิเศษ
            </h4>
            <div>
              <div
                v-if="!canEditField(orderData, 'specialRequests')"
                class="text-blue-900 py-2"
              >
                {{ orderData.specialRequests || "ไม่มีคำขอพิเศษ" }}
              </div>
              <textarea
                v-else
                v-model="formData.specialRequests"
                rows="3"
                placeholder="กรอกคำขอพิเศษ..."
                class="w-full p-3 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-blue-50 text-blue-900"
              />
            </div>
          </div>
        </div>

        <!-- Seats Information (if not STANDING) -->
        <div
          v-if="shouldShowSeatsSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="mdi mdi-seat-passenger text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">ที่นั่งที่จอง</h3>
              <span
                class="bg-blue-200 text-blue-900 px-2 py-1 rounded-full text-xs font-medium"
                >{{ orderData.seats.length }} ที่นั่ง</span
              >
            </div>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
          >
            <div
              v-for="seat in orderData.seats"
              :key="seat.id"
              class="bg-blue-50 border border-blue-200 rounded-md p-2 text-center"
            >
              <div class="font-bold text-blue-900">{{ seat.seatNumber }}</div>
              <div class="text-xs text-blue-700 capitalize">
                {{ seat.zone.name.replace("-", " ") }}
              </div>
            </div>
          </div>
        </div>

        <!-- Standing Tickets (if STANDING) -->
        <div
          v-if="shouldShowStandingSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-human-queue text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ตั๋วยืน</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-2xl font-bold text-blue-700">
                {{ orderData.standingAdultQty }}
              </div>
              <div class="text-sm text-blue-700">ผู้ใหญ่</div>
            </div>
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-2xl font-bold text-blue-700">
                {{ orderData.standingChildQty }}
              </div>
              <div class="text-sm text-blue-700">เด็ก</div>
            </div>
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-lg font-bold text-blue-700">
                {{ formatCurrency(orderData.standingTotal) }}
              </div>
              <div class="text-sm text-blue-700">ยอดรวม</div>
            </div>
          </div>
        </div>

        <!-- Non-Editable Order Notice -->
        <div
          v-if="!canEditAnything"
          class="bg-yellow-50 rounded-xl shadow-md border border-yellow-200 p-6"
        >
          <div class="flex items-start gap-3">
            <i class="mdi mdi-information text-yellow-600 text-2xl mt-1"></i>
            <div class="flex-1">
              <h3 class="font-semibold text-yellow-800 mb-2">
                ไม่สามารถแก้ไขคำสั่งซื้อนี้ได้
              </h3>
              <div class="text-yellow-700 space-y-2">
                <div
                  v-if="
                    orderData?.ticketType === 'STANDING' &&
                    orderData?.purchaseType === 'ONSITE'
                  "
                >
                  <p class="mb-2">
                    ❌
                    <strong>บัตรยืน (ซื้อหน้างาน)</strong>
                    ไม่สามารถแก้ไขข้อมูลใดๆ ได้หลังจากซื้อแล้ว
                  </p>
                  <ul class="text-sm space-y-1 ml-4">
                    <li>• ไม่สามารถเปลี่ยนจำนวนบัตรได้</li>
                    <li>• ไม่สามารถเปลี่ยนข้อมูลผู้ซื้อได้</li>
                    <li>• ไม่สามารถเปลี่ยนสถานะการชำระเงินได้</li>
                  </ul>
                </div>
                <div
                  v-else-if="
                    orderData?.ticketType === 'STANDING' &&
                    orderData?.purchaseType === 'BOOKING' &&
                    orderData?.orderStatus === 'PAID'
                  "
                >
                  <p class="mb-2">
                    ❌ <strong>บัตรยืน (จองล่วงหน้า)</strong> ที่ชำระเงินแล้ว
                    ไม่สามารถแก้ไขได้
                  </p>
                  <ul class="text-sm space-y-1 ml-4">
                    <li>• การชำระเงินเสร็จสิ้นแล้ว ไม่สามารถเปลี่ยนแปลงได้</li>
                    <li>• หากต้องการเปลี่ยนแปลง กรุณาติดต่อฝ่ายสนับสนุน</li>
                  </ul>
                </div>
                <p class="text-sm mt-3 p-3 bg-yellow-100 rounded-lg">
                  💡
                  <strong>หมายเหตุ:</strong>
                  นโยบายนี้เพื่อรักษาความถูกต้องของข้อมูลและป้องกันการเปลี่ยนแปลงที่ไม่เหมาะสม
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Section -->
        <div
          v-if="canEditAnything"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-pencil text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">แก้ไขข้อมูล</h3>
          </div>

          <div class="space-y-4">
            <!-- Stadium Zone Selector -->
            <div v-if="shouldShowSeatsSection(orderData)" class="space-y-4">
              <h4
                class="font-medium text-blue-800 mb-3 flex items-center gap-2"
              >
                <i class="mdi mdi-stadium text-blue-600"></i>
                ตัวเลือกโซนและที่นั่ง
              </h4>

              <!-- Zone Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-blue-700 mb-2"
                  >เลือกโซนที่ต้องการดู</label
                >
                <BaseSelect
                  v-model="selectedZoneId"
                  :options="zoneOptions"
                  placeholder="เลือกโซน"
                  class="w-full"
                />
                <div class="text-xs text-blue-600 mt-1">
                  โซนปัจจุบัน: {{ selectedZoneId || "ยังไม่ได้เลือก" }}
                  <br />
                  Zone UUID: {{ ZONE_IDS_BY_NAME[selectedZoneId] || "ไม่พบ" }}
                </div>
              </div>

              <!-- Stadium Zone Display -->
              <div
                v-if="selectedZoneId"
                class="bg-blue-50 rounded-lg p-4 border border-blue-200"
              >
                <div class="flex items-center justify-between mb-3">
                  <h5 class="text-sm font-medium text-blue-800">
                    โซน: {{ getZoneName(selectedZoneId) }}
                    <span
                      v-if="['left', 'right'].includes(selectedZoneId)"
                      class="text-xs text-blue-600 ml-2"
                    >
                      (แสดงแนวนอน)
                    </span>
                  </h5>
                  <div
                    v-if="loadingSeatData"
                    class="flex items-center gap-2 text-blue-600"
                  >
                    <i class="mdi mdi-loading mdi-spin"></i>
                    <span class="text-sm">กำลังโหลดที่นั่ง...</span>
                  </div>
                </div>

                <!-- Seat Layout Display -->
                <div
                  v-if="!loadingSeatData && realSeatData.length > 0"
                  class="space-y-4"
                >
                  <!-- Check if it's a vertical zone (left/right) and rotate the layout -->
                  <div
                    class="flex items-center w-full overflow-x-auto"
                    :class="{
                      'justify-center': !['left', 'right'].includes(
                        selectedZoneId
                      ),
                      'justify-start': ['left', 'right'].includes(
                        selectedZoneId
                      ),
                    }"
                  >
                    <div
                      :class="{
                        // For left/right zones: display horizontally (rotate the entire layout)
                        'flex gap-2 items-start': ['left', 'right'].includes(
                          selectedZoneId
                        ),
                        // For other zones: display normally (vertically)
                        'flex flex-col gap-3 items-center': ![
                          'left',
                          'right',
                        ].includes(selectedZoneId),
                      }"
                    >
                      <div
                        v-for="(row, rowIndex) in realSeatData"
                        :key="rowIndex"
                        :class="{
                          // For left/right zones: each row becomes a vertical column
                          'flex flex-col gap-1': ['left', 'right'].includes(
                            selectedZoneId
                          ),
                          // For other zones: each row stays horizontal
                          'flex gap-1 items-center justify-center': ![
                            'left',
                            'right',
                          ].includes(selectedZoneId),
                        }"
                      >
                        <div
                          v-for="(seat, colIndex) in row"
                          :key="colIndex"
                          class="flex-shrink-0"
                          :style="{ minWidth: '36px', minHeight: '36px' }"
                        >
                          <SeatIcon
                            v-if="seat && seat.seatNumber"
                            :seat="seat"
                            :status="getSeatStatus(seat)"
                            :selectedSeats="getSelectedSeatsForDisplay()"
                            :bookedSeats="getBookedSeatsForDisplay()"
                            :zoneKey="selectedZoneId"
                            @toggle="handleSeatClick"
                            :ownSeatIds="getOwnSeatIds()"
                            class="w-9 h-12 transition-all duration-300 hover:scale-110 cursor-pointer"
                            style="font-size: 10px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Show current order seats in this zone -->
                  <div
                    v-if="getCurrentZoneSeats().length > 0"
                    class="bg-green-50 rounded-lg p-3 mt-4"
                  >
                    <h6 class="text-sm font-medium text-green-700 mb-2">
                      ที่นั่งปัจจุบันของออเดอร์นี้ในโซนนี้ ({{
                        getCurrentZoneSeats().length
                      }}
                      ที่นั่ง):
                    </h6>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="seat in getCurrentZoneSeats()"
                        :key="seat.id"
                        class="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-md font-medium"
                      >
                        {{ seat.seatNumber }}
                      </span>
                    </div>
                    <div class="text-xs text-green-600 mt-2">
                      💡 คลิกที่นั่งเขียว (ของออเดอร์นี้) เพื่อนำออกจากออเดอร์
                    </div>
                  </div>

                  <!-- Show selected seats for change -->
                  <div
                    v-if="getSelectedSeatsInCurrentZone().length > 0"
                    class="bg-blue-50 rounded-lg p-3 mt-4"
                  >
                    <h6 class="text-sm font-medium text-blue-700 mb-2">
                      ที่นั่งที่เลือกใหม่ในโซนนี้ ({{
                        getSelectedSeatsInCurrentZone().length
                      }}
                      ที่นั่ง):
                    </h6>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="seatNumber in getSelectedSeatsInCurrentZone()"
                        :key="seatNumber"
                        class="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-md font-medium"
                      >
                        {{ seatNumber }}
                      </span>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div
                    class="flex justify-center flex-wrap gap-6 text-sm font-medium bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 mt-4"
                  >
                    <div
                      class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-slate-200"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center"
                      >
                        <i class="mdi mdi-seat text-slate-600 text-sm"></i>
                      </div>
                      <span class="text-slate-700 font-semibold">ว่าง</span>
                    </div>

                    <div
                      class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-green-200"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-300 rounded-lg flex items-center justify-center"
                      >
                        <i class="mdi mdi-check-circle text-white text-sm"></i>
                      </div>
                      <span class="text-green-600 font-semibold"
                        >ออเดอร์นี้ (คลิกเพื่อนำออก)</span
                      >
                    </div>

                    <div
                      class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-blue-200"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-300 rounded-lg flex items-center justify-center"
                      >
                        <i class="mdi mdi-check-circle text-white text-sm"></i>
                      </div>
                      <span class="text-blue-600 font-semibold">เลือกใหม่</span>
                    </div>

                    <div
                      class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-amber-200"
                    >
                      <div
                        class="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-200 border-2 border-amber-400 rounded-lg flex items-center justify-center"
                      >
                        <i class="mdi mdi-lock text-amber-600 text-sm"></i>
                      </div>
                      <span class="text-amber-600 font-semibold">ถูกล็อก</span>
                    </div>

                    <div
                      class="flex items-center gap-3 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div
                        class="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center"
                      >
                        <i
                          class="mdi mdi-close-circle text-gray-400 text-sm"
                        ></i>
                      </div>
                      <span class="text-gray-500 font-semibold line-through"
                        >ไม่ว่าง</span
                      >
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="!loadingSeatData && realSeatData.length === 0"
                  class="text-center text-gray-500 py-4"
                >
                  <div class="flex flex-col items-center gap-2">
                    <i
                      class="mdi mdi-seat-passenger-outline text-gray-400 text-3xl"
                    ></i>
                    <p>ไม่พบข้อมูลที่นั่งในโซนนี้</p>
                    <div class="text-sm text-gray-400 space-y-1">
                      <p>Zone Key: {{ selectedZoneId }}</p>
                      <p>
                        Zone UUID:
                        {{ ZONE_IDS_BY_NAME[selectedZoneId] || "ไม่พบ UUID" }}
                      </p>
                      <p>Original Show Date: {{ orderData?.showDate }}</p>
                      <p>Using Date: 2025-08-10 (Current)</p>
                    </div>
                    <button
                      @click="getRealSeatLayout"
                      class="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      ลองโหลดใหม่
                    </button>
                  </div>
                </div>
              </div>

              <!-- Seat Selection (only for RINGSIDE) -->
              <div
                v-if="
                  canEditField(orderData, 'seatIds') &&
                  shouldShowSeatsSection(orderData)
                "
              >
                <label class="block text-sm font-medium text-blue-700 mb-2"
                  >ที่นั่งใหม่</label
                >

                <!-- Current seats display -->
                <div
                  class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div class="text-sm text-blue-700 mb-2">ที่นั่งปัจจุบัน:</div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="seat in orderData.seats"
                      :key="seat.id"
                      class="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-md font-medium"
                    >
                      {{ seat.seatNumber }}
                    </span>
                  </div>
                </div>

                <!-- Seat selection button -->
                <button
                  @click="openSeatSelector"
                  type="button"
                  class="mb-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                >
                  <i class="mdi mdi-seat-passenger"></i>
                  เลือกที่นั่งใหม่
                </button>

                <!-- Selected seats from seat manager -->
                <div
                  v-if="seatManager.selectedSeatCount.value > 0"
                  class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div class="text-sm text-green-700 mb-2">
                    ที่นั่งที่เลือกใหม่ ({{
                      seatManager.selectedSeatCount.value
                    }}
                    ที่นั่ง):
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="seat in seatManager.mySelectedSeatsArray.value"
                      :key="seat.id"
                      class="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-md font-medium"
                    >
                      {{ seat.seatNumber }}
                    </span>
                  </div>
                  <div class="text-xs text-green-600 mt-1">
                    ราคารวม: {{ formatCurrency(seatManager.totalPrice.value) }}
                  </div>
                </div>

                <!-- Manual seat input as fallback -->
                <textarea
                  v-model="seatIdsText"
                  rows="3"
                  placeholder="กรอกหมายเลขที่นั่งใหม่ (คั่นด้วยเครื่องหมายจุลภาค)"
                  class="w-full px-3 py-2 border border-blue-200 rounded-md bg-blue-50 text-blue-900 placeholder-blue-400 resize-none"
                ></textarea>
                <div class="text-xs text-blue-600 mt-1">
                  ตัวอย่าง: A1, A2, B5 (คั่นด้วยเครื่องหมายจุลภาค)
                  หรือใช้ปุ่มเลือกที่นั่งด้านบน
                </div>
              </div>
            </div>

            <!-- Payment Amount and Date Selection in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Payment Amount -->
              <div v-if="canEditField(orderData, 'paymentAmount')">
                <label class="block text-sm font-medium text-blue-700 mb-2"
                  >ยอดเงินที่จ่าย</label
                >
                <BaseInput
                  v-model.number="formData.paymentAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="กรอกยอดเงินที่จ่าย"
                  class="w-full bg-blue-50 border-blue-200 text-blue-900"
                />
                <div class="text-xs text-blue-600 mt-1">
                  ยอดเงินออเดอร์: {{ formatCurrency(formData.total) }}
                </div>
              </div>

              <!-- Date Selection - Always show, always editable -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-blue-700 mb-2"
                  >วันที่แสดง</label
                >
                <DatePicker
                  v-model="formData.newShowDate"
                  placeholder="เลือกวันที่"
                  :minDate="new Date()"
                  @update:modelValue="handleDateChange"
                  class="w-full bg-blue-50 border-blue-200 text-blue-900"
                />
                <div class="text-xs text-blue-600">
                  วันที่ปัจจุบัน: {{ formData.newShowDate || "ยังไม่ได้เลือก" }}
                </div>
              </div>
            </div>

            <!-- Seat Selection (only for RINGSIDE) -->
            <div
              v-if="
                canEditField(orderData, 'seatIds') &&
                shouldShowSeatsSection(orderData)
              "
            >
              <label class="block text-sm font-medium text-blue-700 mb-2"
                >ที่นั่งใหม่</label
              >
              <textarea
                v-model="seatIdsText"
                rows="3"
                class="w-full p-3 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-blue-50 text-blue-900"
                placeholder="ใส่หมายเลขที่นั่งคั่นด้วยเครื่องหมายจุลภาค เช่น 470, 471, 472"
              />
              <div
                class="flex justify-between items-center mt-2 text-sm text-blue-700"
              >
                <span
                  >ที่นั่งเดิม:
                  {{
                    orderData.seats.map((seat) => seat.seatNumber).join(", ")
                  }}</span
                >
                <span
                  >ที่นั่งที่เลือก: {{ formData.seatIds.length }} ที่นั่ง</span
                >
              </div>
            </div>

            <!-- Validation Errors -->
            <div
              v-if="validationErrors.length > 0"
              class="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm"
            >
              <div
                class="flex items-center gap-2 text-blue-900 font-medium mb-2"
              >
                <i class="mdi mdi-alert-circle-outline"></i>
                ข้อผิดพลาด
              </div>
              <ul class="text-blue-700 text-sm space-y-1">
                <li
                  v-for="error in validationErrors"
                  :key="error"
                  class="flex items-start gap-2"
                >
                  <i
                    class="mdi mdi-close-circle text-blue-700 mt-0.5 text-xs"
                  ></i>
                  {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="$router.go(-1)"
            class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors"
          >
            ยกเลิก
          </button>
          <button
            v-if="canEditAnything"
            @click="saveChanges"
            :disabled="!canSave || saving"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white font-medium rounded-md transition-colors flex items-center gap-2 shadow-md"
          >
            <i v-if="saving" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-content-save"></i>
            {{ saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง" }}
          </button>
        </div>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-8 max-w-md mx-auto"
        >
          <i
            class="mdi mdi-alert-circle-outline text-blue-500 text-4xl mb-4"
          ></i>
          <h3 class="text-blue-700 font-bold mb-2 text-lg">
            ไม่สามารถโหลดข้อมูลออเดอร์ได้
          </h3>
          <p class="text-blue-700 mb-4">{{ error }}</p>
          <button
            @click="loadOrder"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors inline-flex items-center gap-2"
          >
            <i class="mdi mdi-refresh"></i>
            ลองใหม่
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Stadium Zone Selector -->
    <ModalStadiumZoneSelector
      :isOpen="isShowModal"
      @close="closeSeatSelector"
      @confirm="handleSeatConfirm"
    />
  </div>
</template>

<script setup>
// เพิ่ม middleware
definePageMeta({
  middleware: ["only-admin-staff"],
});

import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrder } from "@/composables/useOrder";
import { usePayments } from "@/composables/usePayments";
import { useReferrer } from "@/composables/useReferrer";
import { useSingleToast } from "@/composables/useSingleToast";
import { useSeatApi } from "@/composables/useSeatApi";
import { useEnhancedOrderSystem } from "@/composables/useEnhancedOrderSystem";
import { useIntegratedSeatBooking } from "@/composables/useIntegratedSeatBooking";
import { useRealTimeSeatManager } from "@/composables/useRealTimeSeatManager";
import { ZONE_IDS_BY_NAME } from "@/utils/zoneEnums";
import { buildSeatLayoutFromCoordinates } from "@/utils/buildSeatLayout";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getStatusConfig,
  getPaymentStatusConfig,
  getTicketTypeConfig,
  getPurchaseTypeConfig,
  canEditField,
  shouldShowField,
  shouldShowSeatsSection,
  shouldShowCustomerSection,
  shouldShowStandingSection,
} from "@/utils/orderStatusUtils";
import { OrderStatus, TicketType, OrderPurchaseType } from "@/types/Enums";
import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const { getOrderById, changeSeats } = useOrder();
const { showToast } = useSingleToast();
const { createSeatedPayment } = usePayments();
const { getReferrers } = useReferrer();
const { masterData, fetchMasterData } = useReferrerMasterData();
const { getSeatsByZoneId } = useSeatApi();

// Enhanced seat booking system
const { lockSeats, unlockSeats } = useEnhancedOrderSystem();
const seatBookingSystem = useIntegratedSeatBooking();
const seatManager = useRealTimeSeatManager();

const isShowModal = ref(false);

// Image path helper
const getImagePath = (path) => path;

// Stadium Zone Display
const selectedZoneId = ref("");

// Zone options for select dropdown
const zoneOptions = ref([
  { label: "Back Left", value: "back-left" },
  { label: "Back Right", value: "back-right" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Front Ringside", value: "front-ringside" },
]);

// Debug zone mapping
console.log("Available zone mappings:", ZONE_IDS_BY_NAME);

// Real seat data storage
const realSeatData = ref([]);
const loadingSeatData = ref(false);

// Reactive data
const orderId = route.params.id;
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const orderData = ref(null);
const referrers = ref([]);

// Form data
const formData = ref({
  seatIds: [],
  newReferrerCode: "",
  newCustomerName: "",
  newCustomerPhone: "",
  newCustomerEmail: "",
  newShowDate: "",
  newSource: "",
  status: "",
  paymentStatus: "",
  totalAmount: 0,
  // Hotel & Transportation fields
  hotelName: "",
  hotelDistrict: "",
  roomNumber: "",
  adultCount: 0,
  childCount: 0,
  infantCount: 0,
  voucherNumber: "",
  pickupScheduledTime: "",
  bookerName: "",
  includesPickup: false,
  includesDropoff: false,
  requiresPickup: false,
  requiresDropoff: false,
  pickupHotel: "",
  dropoffLocation: "",
  pickupTime: "",
  dropoffTime: "",
  voucherCode: "",
  referenceNo: "",
  specialRequests: "",
  // Payment fields
  total: 0,
  paymentAmount: 0,
});

// Computed for seat IDs text area
const seatIdsText = ref("");

// Watch for seat IDs text changes
watch(seatIdsText, (newValue) => {
  formData.value.seatIds = newValue
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
});

const canSave = computed(() => {
  return validationErrors.value.length === 0 && !saving.value;
});

// Computed to check if anything can be edited
const canEditAnything = computed(() => {
  if (!orderData.value) return false;

  // Check if any field can be edited
  const editableFields = [
    "seatIds",
    "newShowDate",
    "newReferrerCode",
    "newCustomerName",
    "newCustomerPhone",
    "newCustomerEmail",
    "newSource",
    // Hotel & Transportation fields
    "hotelName",
    "hotelDistrict",
    "roomNumber",
    "adultCount",
    "childCount",
    "infantCount",
    "voucherNumber",
    "pickupScheduledTime",
    "bookerName",
    "includesPickup",
    "includesDropoff",
    "requiresPickup",
    "requiresDropoff",
    "pickupHotel",
    "dropoffLocation",
    "pickupTime",
    "dropoffTime",
    "voucherCode",
    "referenceNo",
    "specialRequests",
    // Payment fields
    "paymentAmount",
  ];

  return editableFields.some((field) => canEditField(orderData.value, field));
});

// Source options for select
const sourceOptions = [
  { value: "WEBSITE", label: "เว็บไซต์" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "LINE", label: "LINE" },
  { value: "PHONE", label: "โทรศัพท์" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "OTHER", label: "อื่นๆ" },
];

// Format date to DD-MM-YYYY for Thai display
const formatThaiDate = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const d = dayjs(dateString, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY"]);
  return d.isValid() ? d.format("DD-MM-YYYY") : dateString;
};

const formatDate = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const date = new Date(dateString);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Load order data
const loadOrder = async () => {
  try {
    loading.value = true;
    error.value = "";

    const data = await getOrderById(orderId);
    orderData.value = data;

    console.log("orderData loaded:", orderData.value);
    console.log("showDate from server:", data.showDate);
    console.log("formatted showDate:", formatThaiDate(data.showDate));

    // Initialize form data
    // Normalize showDate to YYYY-MM-DD for DatePicker (always)
    let normalizedShowDate = "";
    if (data.showDate) {
      // Manual parse DD/MM/YYYY to YYYY-MM-DD
      const ddmmyyyy = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
      const match = data.showDate.match(ddmmyyyy);
      if (match) {
        // match[1]=day, match[2]=month, match[3]=year
        normalizedShowDate = `${match[3]}-${match[2]}-${match[1]}`;
      } else {
        // fallback to dayjs
        let d = dayjs(data.showDate, "YYYY-MM-DD", true);
        if (!d.isValid()) {
          d = dayjs(data.showDate);
        }
        normalizedShowDate = d.isValid() ? d.format("YYYY-MM-DD") : "";
      }
    }
    formData.value = {
      seatIds: data.seats.map((seat) => seat.id) || [],
      newReferrerCode: data.referrer?.code || "",
      newCustomerName: data.customerName || "",
      newCustomerPhone: data.customerPhone || "",
      newCustomerEmail: data.email || "",
      newShowDate: normalizedShowDate,
      totalAmount: data.totalAmount || 0,
      newSource: data.source || "",
      status: data.status,
      paymentStatus: data.paymentStatus,
      // Hotel & Transportation fields
      hotelName: data.hotelName || "",
      hotelDistrict: data.hotelDistrict || "",
      roomNumber: data.roomNumber || "",
      adultCount: data.adultCount || 0,
      childCount: data.childCount || 0,
      infantCount: data.infantCount || 0,
      voucherNumber: data.voucherNumber || "",
      pickupScheduledTime: data.pickupScheduledTime || "",
      bookerName: data.bookerName || "",
      includesPickup: data.includesPickup || false,
      includesDropoff: data.includesDropoff || false,
      requiresPickup: data.requiresPickup || false,
      requiresDropoff: data.requiresDropoff || false,
      pickupHotel: data.pickupHotel || "",
      dropoffLocation: data.dropoffLocation || "",
      pickupTime: data.pickupTime || "",
      dropoffTime: data.dropoffTime || "",
      voucherCode: data.voucherCode || "",
      referenceNo: data.referenceNo || "",
      specialRequests: data.specialRequests || "",
      // Payment fields
      total: data.totalAmount || 0,
      paymentAmount: data.paymentAmount || data.totalAmount || 0,
    };
    console.log(" formData.value", formData.value);

    seatIdsText.value = data.seats.map((seat) => seat.seatNumber).join(", ");
  } catch (err) {
    error.value = err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  } finally {
    loading.value = false;
  }
};

// Load referrers data
const loadReferrers = async () => {
  try {
    const data = await getReferrers({ limit: 1000 });
    referrers.value = data.data;
  } catch (err) {
    console.error("Error loading referrers:", err);
  }
};

const handleDateChange = async (newDate) => {
  // Always convert to YYYY-MM-DD for both display and value
  const d = dayjs(newDate);
  formData.value.newShowDate = d.isValid() ? d.format("YYYY-MM-DD") : newDate;

  // Note: Seat clearing and reloading is handled by the watch on formData.value.newShowDate
}; // Stadium Zone Selector Methods
const getZoneName = (zoneId) => {
  console.log("zoneId", zoneId);

  const zone = zoneOptions.value.find((z) => z.value === zoneId);
  return zone ? zone.label : zoneId;
};

const getCurrentZoneSeats = () => {
  if (!orderData.value?.seats || !selectedZoneId.value) return [];
  return orderData.value.seats.filter(
    (seat) => seat.zone?.key === selectedZoneId.value
  );
};

const getRealSeatLayout = async () => {
  if (!selectedZoneId.value) {
    realSeatData.value = [];
    return [];
  }

  try {
    loadingSeatData.value = true;

    // ใช้วันที่ที่เลือกในฟอร์ม หรือวันที่ของออเดอร์ หรือวันที่ปัจจุบัน
    const dateToUse =
      formData.value.newShowDate || orderData.value?.showDate || "2025-08-10";

    // Convert zone name to zone UUID using ZONE_IDS_BY_NAME mapping
    const zoneUuid = ZONE_IDS_BY_NAME[selectedZoneId.value];
    if (!zoneUuid) {
      console.error("No UUID found for zone:", selectedZoneId.value);
      realSeatData.value = [];
      loadingSeatData.value = false;
      return [];
    }

    console.log(
      `Fetching seats for zone: ${selectedZoneId.value}, date: ${dateToUse}`
    );

    // Fetch seat data directly using getSeatsByZoneId with selected date
    const seats = await getSeatsByZoneId(zoneUuid, dateToUse);

    if (seats?.data && seats.data.length > 0) {
      // Use the same function as ModalStadiumZoneSelector
      const layoutArray = buildSeatLayoutFromCoordinates(seats.data);
      realSeatData.value = layoutArray;

      // Try to initialize the booking system with the fetched data
      try {
        await seatBookingSystem.initializeSeats(
          () => Promise.resolve(seats),
          selectedZoneId.value,
          dateToUse
        );
      } catch (bookingError) {
        console.warn("Failed to initialize booking system:", bookingError);
        // Continue anyway as we have the seat data
      }
    } else {
      realSeatData.value = [];
    }

    loadingSeatData.value = false;
    return realSeatData.value;
  } catch (error) {
    console.error("Error loading real seat data:", error);
    realSeatData.value = [];
    loadingSeatData.value = false;
    return [];
  }
};

// Watch for zone changes to load seat data
watch(selectedZoneId, async (newZoneId) => {
  if (newZoneId && orderData.value?.showDate) {
    await getRealSeatLayout();
  }
});

// Watch for order data to auto-select zone
watch(orderData, (newOrderData) => {
  if (newOrderData?.seats?.length > 0 && !selectedZoneId.value) {
    // Auto-select the zone of the first seat in the order
    const firstSeatZone = newOrderData.seats[0]?.zone?.name;
    if (
      firstSeatZone &&
      zoneOptions.value.some((z) => z.value === firstSeatZone)
    ) {
      selectedZoneId.value = firstSeatZone;
    }
  }
});

// Seat Management Functions
const openSeatSelector = () => {
  isShowModal.value = true;
};

const closeSeatSelector = () => {
  isShowModal.value = false;
};

const handleSeatConfirm = async (selectedSeats) => {
  try {
    // อัปเดต seatIdsText ด้วยที่นั่งที่เลือก
    const seatNumbers = selectedSeats.map((seat) => seat.seatNumber);
    seatIdsText.value = seatNumbers.join(", ");

    // อัปเดต formData
    formData.value.seatIds = selectedSeats.map((seat) => seat.id);

    // อัปเดตราคาถ้าจำเป็น
    if (selectedSeats.length > 0 && selectedSeats[0].price) {
      const totalPrice = selectedSeats.reduce(
        (sum, seat) => sum + (seat.price || 1800),
        0
      );
      formData.value.totalAmount = totalPrice;
      formData.value.paymentAmount = totalPrice;
    }

    closeSeatSelector();
    showToast("success", `เลือกที่นั่งเรียบร้อย: ${seatNumbers.join(", ")}`);
  } catch (error) {
    console.error("Error handling seat confirmation:", error);
    showToast("error", "เกิดข้อผิดพลาดในการเลือกที่นั่ง");
  }
};

const handleSeatClick = async (seat) => {
  // ตรวจสอบสถานะที่นั่งก่อน
  const status = seat.bookingStatus || seat.status;
  const isLocked =
    seat.isLockedUntil && new Date(seat.isLockedUntil) > new Date();

  // ตรวจสอบว่าเป็นที่นั่งของออเดอร์ปัจจุบันหรือไม่
  const isOwnSeat = orderData.value?.seats?.some(
    (orderSeat) =>
      orderSeat.id === seat.id || orderSeat.seatNumber === seat.seatNumber
  );

  // ถ้าเป็นที่นั่งของออเดอร์ปัจจุบัน ให้เพิ่มลงใน textarea เพื่อนำออก
  if (isOwnSeat) {
    const currentSeats = seatIdsText.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    const seatNumber = seat.seatNumber;

    if (currentSeats.includes(seatNumber)) {
      // ลบออกจาก textarea (หมายความว่าไม่ต้องการนำออกจากออเดอร์แล้ว)
      const newSeats = currentSeats.filter((s) => s !== seatNumber);
      seatIdsText.value = newSeats.join(", ");
      showToast("info", `ยกเลิกการนำที่นั่ง ${seatNumber} ออกจากออเดอร์`);
    } else {
      // เพิ่มลง textarea เพื่อบอกว่าต้องการนำออกจากออเดอร์
      currentSeats.push(seatNumber);
      seatIdsText.value = currentSeats.join(", ");
      showToast("warning", `เตรียมนำที่นั่ง ${seatNumber} ออกจากออเดอร์`);
    }

    // อัปเดต formData
    const selectedSeatNumbers = seatIdsText.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    formData.value.seatIds = selectedSeatNumbers;

    // Debug logs
    return;
  }

  // ตรวจสอบว่าที่นั่งว่างหรือไม่
  if (
    status &&
    ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(status.toUpperCase())
  ) {
    showToast("warning", `ที่นั่ง ${seat.seatNumber} ถูกจองแล้ว`);
    return;
  }

  if (isLocked) {
    showToast("warning", `ที่นั่ง ${seat.seatNumber} ถูกล็อกชั่วคราว`);
    return;
  }

  // เพิ่มหรือลบที่นั่งจาก textarea
  const currentSeats = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const seatNumber = seat.seatNumber;

  if (currentSeats.includes(seatNumber)) {
    // ลบออก
    const newSeats = currentSeats.filter((s) => s !== seatNumber);
    seatIdsText.value = newSeats.join(", ");
    showToast("info", `ลบที่นั่ง ${seatNumber} ออกแล้ว`);
  } else {
    // เพิ่มเข้าไป
    currentSeats.push(seatNumber);
    seatIdsText.value = currentSeats.join(", ");
    showToast("success", `เลือกที่นั่ง ${seatNumber} เรียบร้อย`);
  }

  // อัปเดต formData
  const selectedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  formData.value.seatIds = selectedSeatNumbers;
};

const getSampleSeatLayout = () => {
  // Return real seat data if available, otherwise empty
  return realSeatData.value || [];
};

const getSeatClass = (seat) => {
  // ตรวจสอบว่าที่นั่งนี้เป็นของออเดอร์ปัจจุบันหรือไม่
  const isCurrentOrderSeat = orderData.value?.seats?.some(
    (orderSeat) =>
      orderSeat.seatNumber === seat.seatNumber || orderSeat.id === seat.id
  );

  if (isCurrentOrderSeat) {
    return "bg-green-500 border-green-300 text-white"; // ที่นั่งของออเดอร์นี้
  }

  // Handle different booking statuses from API
  const status = seat.bookingStatus || seat.status;
  if (
    status &&
    ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(status.toUpperCase())
  ) {
    return "bg-red-100 border-red-400 text-red-700"; // จองแล้ว/ไม่ว่าง
  } else if (
    seat.isLockedUntil ||
    (status && ["LOCKED", "SELECTED"].includes(status.toUpperCase()))
  ) {
    return "bg-amber-100 border-amber-400 text-amber-700"; // ถูกล็อคชั่วคราว
  } else {
    return "bg-gray-200 border-gray-300 text-gray-700 hover:bg-blue-100"; // ว่าง
  }
};

const getSeatStatus = (seat) => {
  if (!seat) return "available";

  // ตรวจสอบว่าเป็นที่นั่งของออเดอร์ปัจจุบันหรือไม่
  const isOwnSeat = orderData.value?.seats?.some(
    (orderSeat) =>
      orderSeat.id === seat.id || orderSeat.seatNumber === seat.seatNumber
  );

  if (isOwnSeat) {
    return "selected"; // แสดงเป็นที่นั่งที่เลือกแล้ว (สีเขียว)
  }

  // ตรวจสอบสถานะการจอง
  const status = seat.bookingStatus || seat.status;
  if (
    status &&
    ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(status.toUpperCase())
  ) {
    return "BOOKED";
  }

  // ตรวจสอบการล็อค
  if (seat.isLockedUntil && new Date(seat.isLockedUntil) > new Date()) {
    return "locked";
  }

  // ตรวจสอบว่าอยู่ใน seatIdsText หรือไม่ (ที่นั่งที่จะเปลี่ยนไป)
  const selectedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  if (selectedSeatNumbers.includes(seat.seatNumber)) {
    return "selected";
  }

  return "available";
};

// ฟังก์ชันสำหรับ SeatIcon props
const getSelectedSeatsForDisplay = () => {
  // ส่งรายการที่นั่งที่เลือกใน textarea
  const selectedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  const selectedSeats = realSeatData.value
    .flat()
    .filter((seat) => seat && selectedSeatNumbers.includes(seat.seatNumber));

  return selectedSeats; // Return seat objects, not just IDs
};

const getBookedSeatsForDisplay = () => {
  // ส่งรายการที่นั่งที่ถูกจองแล้ว
  const bookedSeats = realSeatData.value.flat().filter((seat) => {
    if (!seat) return false;
    const status = seat.bookingStatus || seat.status;
    return (
      status &&
      ["BOOKED", "PAID", "PENDING", "RESERVED"].includes(status.toUpperCase())
    );
  });

  return bookedSeats; // Return seat objects, not just IDs
};

const getOwnSeatIds = () => {
  // ส่งรายการที่นั่งของออเดอร์ปัจจุบัน
  const ownSeatIds = orderData.value?.seats?.map((s) => s.id) || [];
  return ownSeatIds;
};

const getSelectedSeatsInCurrentZone = () => {
  // ส่งรายการที่นั่งที่เลือกใน textarea ที่อยู่ในโซนปัจจุบัน
  const selectedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  // หาที่นั่งในโซนปัจจุบันที่ตรงกับที่เลือก
  return selectedSeatNumbers.filter((seatNumber) => {
    return realSeatData.value
      .flat()
      .some((seat) => seat && seat.seatNumber === seatNumber);
  });
};

// Watch for zone changes to load seat data
watch(selectedZoneId, async (newZoneId, oldZoneId) => {
  if (newZoneId && (formData.value.newShowDate || orderData.value?.showDate)) {
    // Clear seat selections when changing zones (except for initial load)
    if (oldZoneId && oldZoneId !== newZoneId) {
      seatIdsText.value = "";
      formData.value.seatIds = [];
      showToast("info", "เปลี่ยนโซนแล้ว - กรุณาเลือกที่นั่งใหม่");
    }

    await getRealSeatLayout();
  }
});

// Watch for order data to auto-select zone
watch(orderData, (newOrderData) => {
  if (newOrderData?.seats?.length > 0 && !selectedZoneId.value) {
    // Auto-select the zone of the first seat in the order
    const firstSeatZone = newOrderData.seats[0]?.zone?.name;
    if (
      firstSeatZone &&
      zoneOptions.value.some((z) => z.value === firstSeatZone)
    ) {
      selectedZoneId.value = firstSeatZone;
    }
  }
});

const validationErrors = computed(() => {
  const errors = [];

  const originalSeats = orderData.value?.seats || [];
  const originalSeatCount = originalSeats.length;

  const modifiedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  if (
    !modifiedSeatNumbers.length &&
    canEditField(orderData.value, "seatIds") &&
    shouldShowSeatsSection(orderData.value)
  ) {
    errors.push("กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง");
  }

  // For all seated tickets, cannot exceed original seat count
  if (
    shouldShowSeatsSection(orderData.value) &&
    modifiedSeatNumbers.length > originalSeatCount
  ) {
    errors.push(
      `ไม่สามารถเลือกที่นั่งเกิน ${originalSeatCount} ที่นั่ง (จำนวนเดิม)`
    );
  }

  // Validate customer info only for editable fields
  // เฉพาะกรณีตั๋วยืน (STANDING) และ ONSITE ไม่ต้องกรอกชื่อ
  const isStandingOnsite =
    orderData.value?.ticketType === TicketType.STANDING ||
    orderData.value?.purchaseType === OrderPurchaseType.ONSITE;
  if (
    canEditField(orderData.value, "newCustomerName") &&
    !formData.value.newCustomerName.trim() &&
    !isStandingOnsite
  ) {
    errors.push("กรุณากรอกชื่อลูกค้า");
  }

  if (
    canEditField(orderData.value, "newShowDate") &&
    !formData.value.newShowDate
  ) {
    errors.push("กรุณาเลือกวันที่แสดง");
  }

  return errors;
});

// Set selected zone based on order data
watch(
  orderData,
  (newOrderData) => {
    if (
      newOrderData &&
      shouldShowSeatsSection(newOrderData) &&
      newOrderData.seats &&
      newOrderData.seats.length > 0
    ) {
      // ตั้งค่าโซนที่เลือกตามที่นั่งแรกในออเดอร์
      const firstSeat = newOrderData.seats[0];
      console.log("firstSeat", firstSeat);

      if (firstSeat.zone?.key) {
        selectedZoneId.value = firstSeat.zone.key;
      } else {
        // fallback เป็น ring-side ถ้าไม่มีข้อมูลโซน
        selectedZoneId.value = "back-left";
      }
    } else if (newOrderData && shouldShowSeatsSection(newOrderData)) {
      // ถ้าไม่มีที่นั่ง ให้ใช้ default zone
      selectedZoneId.value = "back-left";
    }
  },
  { immediate: true }
);

// Watch for show date changes to reload seat data
watch(
  () => formData.value.newShowDate,
  async (newDate, oldDate) => {
    // Only proceed if date actually changed and both values exist
    if (newDate && oldDate && newDate !== oldDate) {
      console.log(
        `Date changed from ${oldDate} to: ${newDate}, clearing seat selections and reloading seat data`
      );

      // Clear seat selections when date changes
      seatIdsText.value = "";
      formData.value.seatIds = [];

      // Reload seat data for the new date
      if (selectedZoneId.value) {
        await getRealSeatLayout();
      }

      showToast("info", "เปลี่ยนวันที่แสดงแล้ว - กรุณาเลือกที่นั่งใหม่");
    } else if (newDate && selectedZoneId.value && !oldDate) {
      // Initial load case
      console.log(
        `Initial date set to: ${newDate}, loading seat data for zone: ${selectedZoneId.value}`
      );
      await getRealSeatLayout();
    }
  }
);

// Set page title
useHead({
  title: `แก้ไขที่นั่ง - Order ${orderId}`,
});

// Save changes
const saveChanges = async () => {
  if (!canSave.value) return;

  try {
    saving.value = true;

    // ถ้ามีการเปลี่ยนแปลงที่นั่ง ให้ใช้ enhanced order system
    const originalSeatIds = orderData.value?.seats?.map((s) => s.id) || [];
    const newSeatIds = formData.value.seatIds;

    const hasSeatsChanged =
      JSON.stringify(originalSeatIds.sort()) !==
      JSON.stringify(newSeatIds.sort());

    if (hasSeatsChanged && newSeatIds.length > 0) {
      // ล็อกที่นั่งใหม่ก่อน
      try {
        await lockSeats(
          newSeatIds,
          formData.value.newShowDate || orderData.value.showDate
        );
        console.log("Successfully locked new seats");
      } catch (lockError) {
        console.warn("Failed to lock seats, proceeding anyway:", lockError);
      }

      // อัปเดตที่นั่ง
      await changeSeats(
        orderId,
        newSeatIds,
        formData.value.newReferrerCode,
        formData.value.newCustomerName,
        formData.value.newCustomerPhone,
        formData.value.newCustomerEmail,
        formData.value.newShowDate,
        formData.value.newSource,
        // Hotel & Transportation fields
        formData.value.hotelName,
        formData.value.hotelDistrict,
        formData.value.roomNumber,
        formData.value.adultCount,
        formData.value.childCount,
        formData.value.infantCount,
        formData.value.voucherNumber,
        formData.value.pickupScheduledTime,
        formData.value.bookerName,
        formData.value.includesPickup,
        formData.value.includesDropoff,
        formData.value.requiresPickup,
        formData.value.requiresDropoff,
        formData.value.pickupHotel,
        formData.value.dropoffLocation,
        formData.value.pickupTime,
        formData.value.dropoffTime,
        formData.value.voucherCode,
        formData.value.referenceNo,
        formData.value.specialRequests,
        // Payment fields
        formData.value.paymentAmount
      );

      // ปลดล็อกที่นั่งเก่า
      try {
        await unlockSeats(originalSeatIds, orderData.value.showDate);
        console.log("Successfully unlocked old seats");
      } catch (unlockError) {
        console.warn("Failed to unlock old seats:", unlockError);
      }
    } else {
      // ถ้าไม่มีการเปลี่ยนแปลงที่นั่ง ให้อัปเดตข้อมูลอื่นๆ เท่านั้น
      await changeSeats(
        orderId,
        originalSeatIds,
        formData.value.newReferrerCode,
        formData.value.newCustomerName,
        formData.value.newCustomerPhone,
        formData.value.newCustomerEmail,
        formData.value.newShowDate,
        formData.value.newSource,
        // Hotel & Transportation fields
        formData.value.hotelName,
        formData.value.hotelDistrict,
        formData.value.roomNumber,
        formData.value.adultCount,
        formData.value.childCount,
        formData.value.infantCount,
        formData.value.voucherNumber,
        formData.value.pickupScheduledTime,
        formData.value.bookerName,
        formData.value.includesPickup,
        formData.value.includesDropoff,
        formData.value.requiresPickup,
        formData.value.requiresDropoff,
        formData.value.pickupHotel,
        formData.value.dropoffLocation,
        formData.value.pickupTime,
        formData.value.dropoffTime,
        formData.value.voucherCode,
        formData.value.referenceNo,
        formData.value.specialRequests,
        // Payment fields
        formData.value.paymentAmount
      );
    }

    // ถ้าเป็นการจ่ายเงิน ให้สร้าง payment record
    // if (formData.value.paymentAmount > 0) {
    //   await createSeatedPayment({
    //     orderId,
    //     amount: formData.value.totalAmount,
    //     method: "CASH",
    //     customerName: formData.value.newCustomerName,
    //     customerEmail: formData.value.newCustomerEmail,
    //     customerPhone: formData.value.newCustomerPhone,
    //     referrerCode: formData.value.newReferrerCode || undefined,
    //   });
    //   router.push("/admin/orders");
    // }

    showToast("success", "บันทึกการเปลี่ยนแปลงเรียบร้อย");
  } catch (err) {
    console.error("Error saving changes:", err);
    showToast("error", err.message);
  } finally {
    saving.value = false;
  }
};

// Load order on mount
onMounted(async () => {
  await loadOrder();
  await loadReferrers();
  await fetchMasterData();

  // Log order data for debugging
  console.log("Order loaded, showDate:", orderData.value?.showDate);
  console.log("Using current date: 2025-08-10 for seat data");
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
