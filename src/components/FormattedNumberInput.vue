<template>
  <input
    v-model="internalValue"
    type="text"
    class="z-0 inline-flex w-full justify-start py-2 placeholder:text-neutral-400 bg-inherit relative focus:outline-none"
    :class="[
      noBorder ? 'border-0' : 'border-b-[1px] border-neutral-600 focus:border-primary',
      customClass,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :placeholder="placeholder"
    :disabled="disabled"
  />
</template>
<script setup lang="ts">
import { computed } from "vue";
import { reverseCurrency, spacedNumber } from "@/utils.js";

const emits = defineEmits(["update:value"]);
const props = defineProps({
  value: {
    type: Number,
    required: false,
  },
  customClass: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  noBorder: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const internalValue = computed({
  get() {
    const _value = props.value;
    return _value === null || isNaN(_value) || _value === undefined
      ? null
      : spacedNumber(_value);
  },
  set(newValue) {
    const _newValue = newValue.replace(/\D/g, "");
    const result = reverseCurrency(_newValue);
    emits("update:value", result ? result : 0);
  },
});
</script>
