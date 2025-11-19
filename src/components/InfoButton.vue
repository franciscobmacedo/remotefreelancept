<template>
  <a
    class="relative group cursor-pointer"
    target="_blank"
    :href="link"
    @click="$emit('onClick')"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <QuestionMarkCircleIcon
      class="w-6 fill-neutral-200 text-neutral-500 hover:fill-secondary hover:text-neutral-800"
    />
    <transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="hover"
        class="absolute px-5 py-3 bg-neutral-300 z-50 w-fit rounded-lg"
        :class="positionClass"
      >
        <div class="relative">
          <div class="">
            <slot><p class="text-sm w-32 text-center">{{ t.whatIsThis }}</p></slot>
          </div>
        </div>
      </div>
    </transition>
  </a>
</template>
<script lang="ts" setup>
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { ref, computed } from "vue";
import { useBreakpoint } from "@/composables/breakpoints";
import { useI18n } from "@/i18n";
const { breakpoint } = useBreakpoint();
const { t } = useI18n();

defineProps({
  link: {
    type: String,
    required: false,
  },
});

const hover = ref(false);

const positionClass = computed(() => {
  if (breakpoint.lgAndUp) {
    return "top-8 left-2";
  }
  if (breakpoint.smAndUp) {
    return "top-8 left-1/2 transform -translate-x-1/2";
  }
  return "top-8 right-2";
});
</script>
