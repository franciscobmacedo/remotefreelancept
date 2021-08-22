<template>
  <v-app>
    <!-- <v-app-bar app color="primary" dark> asdas </v-app-bar> -->

    <v-main>
      <v-container :fill-height="validateCount < 1">
        <!-- <v-row class="text-center">
          <v-col class="mb-4">
            <div class="display-1 font-weight-bold mb-3">
              Portuguese Independent Worker
            </div>
          </v-col>
        </v-row> -->
        <v-row align="center" justify="center">
          <v-col>
            <div class="text-center display-1 font-weight-bold mb-3">
              Portuguese Independent Worker
            </div>
            <Form />
          </v-col>
        </v-row>
        <div v-if="valid">
          <Alert v-if="expenses > 0" />
          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <DisplayFreqToggler />
            </v-col>
            <v-col cols="12" sm="6">
              <MainInfo />
            </v-col>
          </v-row>
          <v-row class="mt-5" align="center" justify="center">
            <v-col cols="12" md="6">
              <Chart
                v-if="valid"
                :chartData="datacollection"
                :chartOptions="options"
                chartType="doughnut"
              />
            </v-col>
            <v-col cols="12" md="6">
              <Details />
            </v-col>
          </v-row>
          <!-- <v-row align="center" justify="center">
          </v-row> -->
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { round, currency } from "@/utils.js";
import Form from "@/components/Form";
import DisplayFreqToggler from "@/components/DisplayFreqToggler";
import MainInfo from "@/components/MainInfo";
import Chart from "@/components/Chart";
import Alert from "@/components/Alert";
import Details from "@/components/Details";
import { mapGetters, mapState } from "vuex";

export default {
  name: "App",
  components: {
    Form,
    DisplayFreqToggler,
    MainInfo,
    Chart,
    Alert,
    Details,
  },
  data() {
    return {
      validateCount: 0,
    };
  },
  watch: {
    valid() {
      this.validateCount++;
    },
  },
  computed: {
    ...mapState(["valid", "grossIncome", "displayFreq"]),
    ...mapGetters(["irsPay", "ssPay", "netIncome", "expenses"]),

    datacollection() {
      return {
        labels: ["irs", "ss", "net \n income"],
        datasets: [
          {
            label: "My First Dataset",
            data: [
              round(this.irsPay[this.displayFreq], 2),
              round(this.ssPay[this.displayFreq], 2),
              round(this.netIncome[this.displayFreq], 2),
            ],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "#76c479",
            ],
            hoverOffset: 4,
          },
        ],
      };
    },
    options() {
      return {
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const val =
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              // const label = data.labels[tooltipItem.index];

              return currency(val, 2);
              // return label + " " + currency(val, 2);
            },
          },
        },
        plugins: {
          datalabels: {
            display: true,
            textAlign: "center",
            formatter: (val, ctx) => {
              // ctx.chart.data.labels[ctx.dataIndex] + "\n" + currency(val)

              return (
                ctx.chart.data.labels[ctx.dataIndex] +
                "\n" +
                round(
                  (val / this.grossIncome[this.displayFreq]) * 100
                ).toString() +
                "%"
              );
            },
            color: "#fff",
            font: {
              size: "13",
            },
            // backgroundColor: "#404040",
          },
          doughnutlabel: {
            labels: [
              {
                text: currency(this.grossIncome[this.displayFreq]),
                font: {
                  size: 20,
                  weight: "bold",
                },
              },
              {
                text: "gross income",
              },
            ],
          },
        },
      };
    },
  },
};
</script>
<style scoped>
body {
  background-color: #f4f4f4;
}
</style>