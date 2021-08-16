import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartDoughnutLabels from 'chartjs-plugin-doughnutlabel';
Chart.plugins.register(ChartDataLabels);
Chart.plugins.register(ChartDoughnutLabels);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
