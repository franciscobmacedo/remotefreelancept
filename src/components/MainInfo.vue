<template>
  <div justify="start">
    <v-row
      v-for="(item, index) of amounts"
      :key="index"
      class="mb-2"
      justify="start"
      align="center"
    >
      <v-chip
        large
        class="mr-2 text-h5 grey--text text--lighten-3"
        :color="item.color"
      >
        {{ item.value }}
        <div class="text-caption">/{{ displayFreq }}</div>
      </v-chip>
      {{ item.text }}
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { currency } from "@/utils.js";

export default {
  computed: {
    ...mapState(["frequencyIncome", "displayFreq"]),
    ...mapGetters(["irsPay", "ssPay", "netIncome"]),
    amounts() {
      return [
        {
          text: "Net Income",
          value: currency(this.netIncome[this.displayFreq]),
          color: "#76c479",
        },
        {
          text: "IRS",
          value: currency(this.irsPay[this.displayFreq]),
          color: "rgb(255, 99, 132)",
        },
        {
          text: "Social Security",
          value: currency(this.ssPay[this.displayFreq]),
          color: "rgb(54, 162, 235)",
        },
      ];
    },
  },
  //   methods: {
  //     currency(val) {
  //       return currency(val);
  //     },
  //   },
};
</script>

<style scoped>
.net-income {
  background-color: rgb(255, 99, 132);
  border-radius: 50%;
}
</style>