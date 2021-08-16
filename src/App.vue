<template>
  <v-app>
    <v-app-bar app color="primary" dark> asdas </v-app-bar>

    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3">
              Portuguese Independent Worker
            </h1>
          </v-col>
        </v-row>
        <Form />
        <div v-if="valid">
          <DisplayFreqToggler />
          <v-row class="mt-5" align="center" justify="center">
            <v-col offset="2" align="center">
              <MainInfo />
            </v-col>
            <v-col>
              <Chart
                v-if="valid"
                :chartData="datacollection"
                :chartOptions="options"
                chartType="doughnut"
              />
            </v-col>
          </v-row>
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
import { mapGetters, mapState } from "vuex";

export default {
  name: "App",
  components: {
    Form,
    DisplayFreqToggler,
    MainInfo,
    Chart,
  },

  computed: {
    ...mapState(["valid", "frequencyIncome", "displayFreq"]),
    ...mapGetters(["irsPay", "ssPay", "netIncome"]),
    datacollection() {
      return {
        labels: ["irs", "ss", "net income"],
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
              return (
                // ctx.chart.data.labels[ctx.dataIndex] + "\n" + currency(val)
                ctx.chart.data.labels[ctx.dataIndex]
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
                text: currency(this.frequencyIncome[this.displayFreq]),
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
