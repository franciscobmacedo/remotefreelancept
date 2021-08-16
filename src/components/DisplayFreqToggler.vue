<template>
  <div class="d-flex flex-column justify-center align-center">
    <div class="text-caption">Show Incom per</div>
    <v-btn-toggle
      tile
      color="deep-purple accent-3"
      group
      v-model="selectedFrequency"
    >
      <v-btn v-for="(item, index) of frequencyItems" :key="index" :value="item">
        {{ item }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { frequencyItems } from "@/utils.js";

export default {
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
  },
};
</script>

<style>
</style>