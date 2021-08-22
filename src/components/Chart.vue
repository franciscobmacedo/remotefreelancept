<template>
  <div>
    <canvas></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    chartType: String,
    chartData: Object,
    chartOptions: Object,
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    let { chartType, chartData, chartOptions } = this;
    this.chartConstructor(chartType, chartData, chartOptions);
  },
  watch: {
    chartData(newData) {
      newData.datasets.forEach((d, i) => {
        this.chart.data.datasets[i].data = d.data;
      });
      this.chart.update();
    },
    chartOptions(newOptions) {
      this.chart.options = newOptions;
      this.chart.update();
    },
  },
  methods: {
    chartConstructor(chartType, chartData, chartOptions) {
      const chartElement = document.querySelector("canvas");
      this.chart = new Chart(chartElement, {
        type: chartType,
        data: chartData,
        options: chartOptions,
      });
    },
  },
};
</script>

<style>
</style>