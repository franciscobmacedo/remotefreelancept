<template>
  <div class="relative" @click="showDropdown = !showDropdown">
    <input
      type="button"
      class="cursor-pointer w-full text-start py-2 placeholder:text-neutral-400 bg-inherit border-b-2 border-neutral-400 relative focus:outline-none focus:border-indigo-400"
      :value="value"
      id="menu-button"
      aria-expanded="true"
      aria-haspopup="true"
      :class="{ 'text-indigo-400': showDropdown }"
    />
    <ChevronDownIcon
      class="absolute h-5 right-0 bottom-3 text-neutral-500"
      :class="{ ' fill-indigo-400': showDropdown }"
    />
    <div
      v-if="showDropdown"
      class="absolute top-full shadow-lg bg-defaultbg overflow-y-auto overflow-x-hidden h-max-64 z-10 min-w-full w-20"
    >
      <button
        v-for="choice in choices"
        class="text-gray-700 block px-4 py-2 text-sm hover:bg-neutral-200 w-full"
        @click="changeChoice(choice)"
      >
        {{ choice }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
const emit = defineEmits(["change"]);
defineProps({
  value: { type: String || Number },
  choices: { type: Array },
});

const showDropdown = ref(false);
const changeChoice = (choice: any) => {
  emit("change", choice);
};
</script>
