<template>
  <v-row justify="space-between">
    <v-col
      class="
        green
        lighten-5
        text-center
        d-flex
        flex-column
        justify-space-between
      "
    >
      <div class="text-md-h6">
        {{ netIncomeFormat }}<span class="caption">/{{ displayFreq }}</span>
      </div>
      <div class="font-weight-medium caption text-md-overline">Net income</div>
    </v-col>
    <v-col class="red lighten-5 text-center offset-1">
      <div class="text-md-h6 text-center">
        {{ taxesFormat }}<span class="caption">/{{ displayFreq }}</span>
      </div>
      <div class="font-weight-medium caption text-md-overline">Taxes</div>
      <v-row justify="center" align="center">
        <v-col
          cols="6"
          class="
            caption
            d-flex
            align-center
            justify-center
            flex-wrap flex-sm-row flex-column
            text-center
            pt-3
            pb-0
            pl-0
            pr-0
          "
        >
          <div class="pr-md-2">{{ irsFormat }}</div>
          <div class="text-center red--text text--lighten-1 caption">IRS</div>
        </v-col>
        <v-col
          cols="6"
          class="
            caption
            d-flex
            align-center
            justify-center
            flex-wrap flex-sm-row flex-column
            text-center
            pt-3
            pb-0
            pl-0
            pr-0
          "
        >
          <div class="pr-md-2">{{ ssFormat }}</div>
          <div class="text-center blue--text text--lighten-1 caption">SS</div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { currency } from "@/utils.js";

export default {
  computed: {
    ...mapState(["colors", "displayFreq"]),
    ...mapGetters(["irsPay", "ssPay", "netIncome"]),
    netIncomeFormat() {
      return currency(this.netIncome[this.displayFreq]);
    },
    taxesFormat() {
      return currency(
        this.irsPay[this.displayFreq] + this.ssPay[this.displayFreq]
      );
    },
    irsFormat() {
      return currency(this.irsPay[this.displayFreq]);
    },
    ssFormat() {
      return currency(this.ssPay[this.displayFreq]);
    },
  },
};
</script>
