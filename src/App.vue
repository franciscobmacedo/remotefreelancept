<template>
  <v-app>
    <v-btn
      elevation="5"
      fab
      absolute
      class="github-btn"
      @click="
        goToExternal('https://github.com/franciscobmacedo/remotefreelancept/')
      "
      ><v-icon>mdi-github</v-icon></v-btn
    >
    <v-main>
      <v-container :fill-height="validateCount < 1">
        <v-row align="center" justify="center">
          <v-col class="pt-0 mt-0">
            <div
              class="text-center font-weight-bold"
              :class="validateCount > 0 ? 'text-h6' : 'display-1 mb-3 mt-2'"
            >
              Remote freelancer from Portugal 🇵🇹
            </div>
            <div
              class="text-center text-h6 font-weight-light"
              :class="validateCount > 0 ? 'text-caption' : 'text-h6 mb-3'"
            >
              simulate your net income
            </div>
            <Form />
          </v-col>
        </v-row>
        <div v-if="valid">
          <Alert v-if="expenses > 0" />
          <v-row class="mt-3 mb-0 pb-o" align="center" justify="center">
            <v-col class="mb-0 pb-0" cols="12" sm="6">
              <DisplayFreqToggler />
            </v-col>
            <v-col class="mb-0 pb-0" cols="12" sm="6">
              <MainInfo />
            </v-col>
          </v-row>
          <v-row class="mt-0 pt-0" align="center" justify="center">
            <v-col cols="12" md="6" class="mt-0 pt-0">
              <Chart
                v-if="valid"
                :chartData="datacollection"
                :chartOptions="options"
                chartType="doughnut"
              />
            </v-col>
            <v-col class="mt-0 pt-0" cols="12" md="6">
              <Details />
            </v-col>
          </v-row>
        </div>
      </v-container>
      <v-footer
        v-if="valid"
        app
        bottom
        fixed
        padless
        align="center"
        justify="center"
      >
        <v-col cols="12">
          <v-divider></v-divider>
          <div class="d-flex justify-space-around">
            <div class="text-caption">
              *Assuming {{ YEAR_BUSINESS_DAYS }} business days in a year and
              {{ MONTH_BUSINESS_DAYS }} business days in a month.
            </div>
            <div class="text-caption">
              This is only valid for independent workers with green receipts
              (trabalhadores independentes com recibos verdes).
            </div>
            <div class="text-caption">
              VAT (IVA) is ignored (only for foreign clients).
            </div>
          </div>
        </v-col>
      </v-footer>
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
  methods: {
    goToExternal(url) {
      window.open(url);
    },
  },
  computed: {
    ...mapState([
      "valid",
      "displayFreq",
      "YEAR_BUSINESS_DAYS",
      "MONTH_BUSINESS_DAYS",
    ]),
    ...mapGetters(["grossIncome", "irsPay", "ssPay", "netIncome", "expenses"]),

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
              return currency(val, 2);
            },
          },
        },
        plugins: {
          datalabels: {
            display: true,
            textAlign: "center",
            formatter: (val, ctx) => {
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
<style >
.v-application {
  background-color: #f4f4f4 !important;
}
.github-btn {
  right: 0.5em;
  top: 0.5em;
}
</style>