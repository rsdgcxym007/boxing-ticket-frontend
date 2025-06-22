<template>
  <canvas ref="canvasEl"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const props = defineProps({
  data: Array,
});

const canvasEl = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (!canvasEl.value) return;
  if (chartInstance) chartInstance.destroy();

  const labels = props.data.map((item) => item.date);
  const amounts = props.data.map((item) => item.amount);

  chartInstance = new Chart(canvasEl.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "ยอดขาย",
          data: amounts,
          backgroundColor: "#3b82f6",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

watch(() => props.data, renderChart, { immediate: true });
onMounted(renderChart);
</script>
