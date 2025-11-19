<template>
  <DropDown
    :choices="choices"
    @change="changeFrequency"
    data-cy="frequency-dropdown"
    :value="currentLabel"
  />
</template>
<script setup lang="ts">
import { FrequencyChoices } from "@/typings";
import { storeToRefs } from "pinia";
import { useTaxesStore } from "@/store";
import { computed } from "vue";
import { useI18n } from "@/i18n";

import DropDown from "@/components/DropDown.vue";

const { incomeFrequency } = storeToRefs(useTaxesStore());
const store = useTaxesStore();
const { t } = useI18n();

const frequencyMap = computed(() => ({
  [t.value.year]: "Year",
  [t.value.month]: "Month",
  [t.value.day]: "Day",
}));

const choices = computed(() => Object.keys(frequencyMap.value));

const currentLabel = computed(() => {
  const key = Object.keys(FrequencyChoices).find(k => FrequencyChoices[k] === incomeFrequency.value);
  return key ? t.value[key.toLowerCase()] : '';
});

const changeFrequency = (label: string) => {
  const key = frequencyMap.value[label];
  if (key) {
    store.setIncomeFrequency(FrequencyChoices[key]);
  }
};
</script>
