<template>
  <div>
    <div class="d-flex flex-row justify-center align-center">
      <div class="text-caption">Show Incom per</div>
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
    <v-row v-if="selectedFrequency == 'month'" align="center" justify="center">
      <v-col cols="10" md="8">
        Number of months to simulate your earnings
      </v-col>
      <v-col cols="2" md="4">
        <v-form ref="form2">
          <v-text-field
            required
            v-model="nrMonths"
            :rules="[(v) => (!!v && v > 0) || 'Months can\'t be 0...']"
            placeholder="maybe you meant 12...?"
          ></v-text-field>
        </v-form>
      </v-col>
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