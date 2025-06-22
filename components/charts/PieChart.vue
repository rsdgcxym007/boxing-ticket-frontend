<template>
  <canvas ref="canvasEl"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, PieController);

const props = defineProps({
  data: Array,
});

const canvasEl = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (!canvasEl.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = props.data.map((item) => item.method);
  const totals = props.data.map((item) => Number(item.total));

  chartInstance = new Chart(canvasEl.value, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: totals,
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
};

watch(() => props.data, renderChart, { immediate: true });
onMounted(renderChart);
</script>
