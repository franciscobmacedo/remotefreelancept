<template>
  <DropDown
    :choices="Object.keys(FrequencyChoices)"
    @change="changeFrequency"
    data-cy="frequency-dropdown"
    :value="incomeFrequency"
  />
</template>
<script setup lang="ts">
import { FrequencyChoices } from "@/typings";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";

import DropDown from "@/components/DropDown.vue";

const { incomeFrequency } = storeToRefs(useTaxesStore());
const store = useTaxesStore();

const changeFrequency = (frequencyChoice: string) => {
  store.setIncomeFrequency(FrequencyChoices[frequencyChoice]);
};
</script>
