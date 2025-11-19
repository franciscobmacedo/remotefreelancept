<template>
  <div class="flex justify-start items-center">
    <button
      class="bg-neutral-300 text-neutral-600 rounded-full font-bold px-1 py-1 hover:bg-neutral-400 hover:text-neutral-100 disabled:bg-neutral-200 disabled:text-neutral-400"
      @click="decreaseValue"
      :disabled="counter <= min"
      data-cy="counter-decrease"
    >
      <MinusIcon class="w-3" />
    </button>
    <span type="number" class="text-center py-2 w-20">
      <slot>
        <FormattedNumberInput
          v-model:value="counterDisplay"
          custom-class="text-center"
        />
      </slot>
    </span>
    <span class="mr-2 text-neutral-500 text-xs" v-if="unit">{{ unit }}</span>
    <button
      class="bg-neutral-300 text-neutral-600 rounded-full font-bold px-1 py-1 hover:bg-neutral-400 hover:text-neutral-100 disabled:bg-neutral-200 disabled:text-neutral-400"
      @click="increaseValue"
      :disabled="counter >= max!"
      data-cy="counter-increase"
    >
      <PlusIcon class="w-3" />
    </button>
  </div>
</template>
<script lang="ts" setup>
import { MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";

import { ref, watch, computed } from "vue";
import FormattedNumberInput from "@/components/FormattedNumberInput.vue";
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: false,
  },
  max: {
    type: Number,
    required: false,
  },
  unit: {
    type: String,
    required: false,
  },
  step: {
    type: Number,
    default: 1,
  },
});

// value
const emits = defineEmits(["update:value"]);

const increaseValue = () => {
  if (!props.max || counter.value < props.max!) {
    const result = counter.value + props.step;
    counter.value = result > props.max ? props.max : result;
    emits("update:value", counter.value);
  }
};

const decreaseValue = () => {
  if (!props.min || counter.value > props.min!) {
    const result = counter.value - props.step;
    counter.value = result < props.min ? props.min : result;
    emits("update:value", counter.value);
  }
};

// counter
const counter = ref(props.value);
const counterDisplay = computed({
  get() {
    return counter.value;
  },
  set(value) {
    let _value = value;
    if (props.max && _value > props.max) {
      _value = props.max;
    } else if (props.min && _value < props.min) {
      _value = props.min;
    }
    counter.value = _value;
    emits("update:value", counter.value);
  },
});

// value updates counter
watch(
  () => props.value,
  (newValue) => {
    counter.value = newValue;
  },
);
</script>
