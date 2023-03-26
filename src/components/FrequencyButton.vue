<template>
  <DropDown
    :choices="Object.keys(FrequencyChoices)"
    @change="changeFrequency"
    :value="incomeFrequency"
  />
</template>
<script setup lang="ts">
import { FrequencyChoices } from "@/typings";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/stores";

import DropDown from "@/components/DropDown.vue";

const { incomeFrequency } = storeToRefs(useTaxesStore());
const store = useTaxesStore();

const changeFrequency = (frequencyChoice: string) => {
  store.setIncomeFrequency(FrequencyChoices[frequencyChoice]);
};
</script>
