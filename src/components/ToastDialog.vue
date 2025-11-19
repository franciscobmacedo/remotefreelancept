<template>
  <div
    v-click-outside="close"
    class="absolute left-1/2 transform -translate-x-1/2 top-3 z-50"
  >
    <div
      class="flex items-center w-full max-w-xs p-4 bg-neutral-200 rounded-lg shadow-lg"
    >
      <div class="ms-3 text-sm font-normal">{{ text }}</div>
      <button
        type="button"
        class="ms-auto -mx-1.5 -my-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#toast-default"
        :aria-label="t.close"
        @click="close()"
      >
        <span class="sr-only">{{ t.close }}</span>
        <XMarkIcon />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "@/i18n";
// store
const { t } = useI18n();
const emits = defineEmits(["close"]);
defineProps({
  text: {
    type: String,
    required: true,
  },
});

setTimeout(() => close(), 3000);
const close = () => emits("close");
</script>
