<template>
  <v-row justify="center" align="center">
    <span class="text-caption text-center d-flex align-center">
      adjust your income for social security
      <v-tooltip
        bottom
        :max-width="$vuetify.breakpoint.smAndUp ? '360' : null"
        color="grey darken-3"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="
              goToExternal(
                'https://www.seg-social.pt/documents/10152/15974914/1009%20Trabalhador%20independente%20-%20novo%20regime/87b6e00c-523d-4718-8a88-942ea804c18a'
              )
            "
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon small>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <span>
          You can adjust your income for social security tax calculations with a
          minimum of -25% and a maximum of +25%. This will probably afect your
          retirement pension. Click in the icon for more information.
        </span>
      </v-tooltip>
    </span>
    <v-col cols="12" class="my-0 py-0 mx-1">
      <v-slider
        v-model="ssDiscount"
        :tick-labels="tickLabels"
        max="10"
        step="1"
        tick-size="6"
        ticks="always"
        @change="setSsDiscount"
      >
      </v-slider>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      ssDiscount: 5,
      tickLabels: [
        "-25%",
        "-20%",
        "-15%",
        "-10%",
        "-5%",
        "0%",
        "5%",
        "10%",
        "15%",
        "20%",
        "25%",
      ],
    };
  },
  methods: {
    goToExternal(url) {
      window.open(url);
    },
    setSsDiscount() {
      this.$store.commit(
        "setSsDiscount",
        parseInt(this.tickLabels[this.ssDiscount].split("%")[0]) / 100
      );
    },
  },
};
</script>
<style scoped>
.v-input {
  font-size: 0.6rem;
}
</style>