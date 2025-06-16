<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">คำสั่งซื้อทั้งหมด</h1>

    <div
      v-for="order in orders"
      :key="order.id"
      class="border p-4 rounded mb-4 shadow"
    >
      <p><strong>โซน:</strong> {{ order.zone }}</p>
      <p><strong>ที่นั่ง:</strong> {{ order.seats }}</p>
      <p><strong>รวม:</strong> {{ order.total }} บาท</p>
      <p><strong>สถานะ:</strong> {{ order.status }}</p>

      <div v-if="order.slipPath" class="mt-2">
        <img
          :src="`http://localhost:3000/${order.slipPath}`"
          class="max-w-xs rounded border"
        />
      </div>

      <div v-if="order.status === 'pending'" class="flex gap-2 mt-4">
        <button
          class="bg-green-500 text-white px-3 py-1 rounded"
          @click="approve(order.id)"
        >
          อนุมัติ
        </button>
        <button
          class="bg-red-500 text-white px-3 py-1 rounded"
          @click="reject(order.id)"
        >
          ปฏิเสธ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const orders = ref([]);

const { get, patch } = useApi();

async function loadOrders() {
  orders.value = await get("/orders/list");
}

async function updateStatus(id, status) {
  await patch(`/orders/${id}/status`, { status });
  await loadOrders();
}

const approve = (id) => updateStatus(id, "approved");
const reject = (id) => updateStatus(id, "rejected");

onMounted(loadOrders);
</script>
