<template>
  <div class="relative w-full h-64 md:h-80">
    <canvas id="comparison-chart"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch, ref, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { ContractComparison, ContractType } from "@/typings";
import { asCurrency } from "@/utils.js";
import { useI18n } from "@/i18n";
import { useComparisonStore } from "@/store/comparison";

Chart.register(...registerables);

const props = defineProps<{
  comparisons: ContractComparison[];
}>();

const { t } = useI18n();
const comparisonStore = useComparisonStore();
let chart: Chart | null = null;

const getContractTypeLabel = (type: ContractType): string => {
  switch (type) {
    case ContractType.RecibosVerdes:
      return t.value.recibosVerdes;
    case ContractType.CTI:
      return t.value.cti;
    case ContractType.Unipessoal:
      return t.value.unipessoal;
    default:
      return type;
  }
};

const chartData = computed(() => {
  const labels = props.comparisons.map(c => getContractTypeLabel(c.type));
  const freq = comparisonStore.displayFrequency;

  const liquidityData = props.comparisons.map(c => 
    c.liquidityExpenses?.[freq] || 0
  );

  const netIncomeData = props.comparisons.map(c => {
    const totalNet = c.finalNetIncome?.[freq] || c.netIncome[freq];
    const liquidity = c.liquidityExpenses?.[freq] || 0;
    return Math.max(0, totalNet - liquidity);
  });

  const taxesData = props.comparisons.map(c => 
    c.totalExpenses?.[freq] || c.totalTaxes[freq]
  );

  return {
    labels,
    datasets: [
      {
        label: t.value.netIncome,
        data: netIncomeData,
        backgroundColor: "#22c55e", // green-500
        borderRadius: 4,
        stack: 'Stack 0',
      },
      {
        label: t.value.liquidity,
        data: liquidityData,
        backgroundColor: "#86efac", // green-300
        borderRadius: 4,
        stack: 'Stack 0',
      },
      {
        label: t.value.totalTaxes, // Using totalTaxes as generic label for expenses/taxes
        data: taxesData,
        backgroundColor: "#ef4444", // red-500
        borderRadius: 4,
        stack: 'Stack 1',
      },
    ],
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += asCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return asCurrency(value);
          }
        }
      }
    }
  };
});

const buildChart = () => {
  const canvas = document.getElementById("comparison-chart") as HTMLCanvasElement;
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: chartData.value,
    options: chartOptions.value,
  });
};

watch(
  () => [props.comparisons, t.value],
  () => {
    if (chart) {
      chart.data = chartData.value;
      chart.options = chartOptions.value;
      chart.update();
    } else {
      buildChart();
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    buildChart();
  });
});
</script>
