<template>
  <div>
    <div class="d-flex flex-row justify-center align-center">
      <div class="text-caption">Show income per</div>
      <v-btn-toggle
        tile
        color="primary accent-3"
        group
        v-model="selectedFrequency"
        :mandatory="true"
      >
        <v-btn
          v-for="(item, index) of frequencyItems"
          :key="index"
          :value="item"
        >
          {{ item }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <v-row align="center" justify="center">
      <v-col cols="8"> Number of months to simulate your earnings </v-col>
      <v-col cols="2">
        <v-form ref="form2">
          <v-text-field
            required
            type="number"
            v-model="nrMonths"
            :rules="[(v) => (!!v && v > 0) || 'this can\'t be 0...']"
          ></v-text-field>
        </v-form>
      </v-col>
      <v-tooltip
        bottom
        :max-width="$vuetify.breakpoint.smAndUp ? '360' : null"
        color="grey darken-3"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
        </template>
        <span>
          In a portugues company, you can get payed 2 extra months per year (for
          holidays and christmas). If you want to compare your remote salary
          with some local company, you should change this field to 14 months.
        </span>
      </v-tooltip>
    </v-row>
  </div>
</template>

<script>
import { frequencyItems } from "@/utils.js";

export default {
  data() {
    return {};
  },
  computed: {
    frequencyItems() {
      return Object.values(frequencyItems);
    },
    selectedFrequency: {
      get() {
        return this.$store.state.displayFreq;
      },
      set(value) {
        this.$store.commit("setDisplayFrequency", value);
      },
    },
    nrMonths: {
      get() {
        return this.$store.state.nrMonthsDisplay;
      },
      set(value) {
        this.$store.commit("setNrMonthsDisplay", value);
      },
    },
  },
};
</script>

<style>
</style>