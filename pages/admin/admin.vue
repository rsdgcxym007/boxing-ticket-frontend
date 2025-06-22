<template>
  <div class="p-8 max-w-5xl mx-auto text-white">
    <h1 class="text-2xl font-bold mb-6">รายการคำสั่งซื้อทั้งหมด</h1>
    <table class="w-full border border-gray-300 text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2">ID</th>
          <th class="p-2">วันที่</th>
          <th class="p-2">โซน</th>
          <th class="p-2">ที่นั่ง</th>
          <th class="p-2">ราคารวม</th>
          <th class="p-2">สถานะ</th>
          <th class="p-2">สลิป</th>
          <th class="p-2">ดำเนินการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="border-t">
          <td class="p-2 text-center">{{ order.id }}</td>
          <td class="p-2">{{ new Date(order.createdAt).toLocaleString() }}</td>
          <td class="p-2">{{ order.zone }}</td>
          <td class="p-2">{{ order.seats }}</td>
          <td class="p-2 text-right">{{ order.total }} ฿</td>
          <td class="p-2 text-center">
            <span
              :class="{
                'text-yellow-600': order.status === 'PENDING',
                'text-green-600': order.status === 'APPROVED',
                'text-red-600': order.status === 'REJECTED',
              }"
            >
              {{ order.status }}
            </span>
          </td>
          <td class="p-2 text-center">
            <a
              v-if="order.slipPath"
              :href="`/uploads/slips/${order.slipPath}`"
              target="_blank"
              class="text-blue-500 underline"
            >
              ดูสลิป
            </a>
          </td>
          <td class="p-2 text-center space-x-2">
            <button
              @click="updateStatus(order.id, 'APPROVED')"
              class="text-green-600 hover:underline"
            >
              ✅
            </button>
            <button
              @click="updateStatus(order.id, 'REJECTED')"
              class="text-red-600 hover:underline"
            >
              ❌
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const orders = ref([]);
const { get, patch } = useApi();

const loadOrders = async () => {
  const res = await get("/orders/list");
  orders.value = res;
};

async function updateStatus(id, status) {
  await fetch(`http://localhost:3000/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await loadOrders();
}

onMounted(loadOrders);
</script>
