<template>
  <div v-if="showDashboard">
    <footer
      class="fixed bottom-0 w-full left-0 text-center border-t-[1px] border-neutral-200 bg-neutral-100 overflow-scroll max-h-24"
      :class="{ 'py-5 md:py-2': breakpoint.mdAndUp }"
    >
      <button
        v-if="breakpoint.smAndDown"
        class="underline text-xs w-full h-full"
        @click="showFooterNotes = !showFooterNotes"
      >
        {{ t.footerNotes }}
      </button>
      <transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform opacity-0"
      >
        <div
          v-if="breakpoint.mdAndUp || showFooterNotes"
          class="flex flex-col lg:flex-row justify-around items-center space-y-3 sm:space-y-0"
          :class="{
            'bg-neutral-300 fixed right-0 w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4':
              breakpoint.smAndDown,
          }"
        >
          <button
            v-if="showFooterNotes"
            type="button"
            class="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            @click="showFooterNotes = !showFooterNotes"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
          <div class="text-xs">
            *{{ t.businessDays.replace('{days}', YEAR_BUSINESS_DAYS) }}
          </div>
          <div class="text-xs">
            {{ t.validFor }}
          </div>
          <div class="text-xs">
            {{ t.vatIgnored }}
          </div>
          <div class="flex justify-center">
            <a
              v-if="breakpoint.smAndDown"
              className="cursor-pointer text-center text-blue-500 p-3 rounded-full shadow-sm hover:shadow-xl"
              target="_blank"
              href="https://github.com/franciscobmacedo/remotefreelancept"
            >
              <img src="@/assets/github-mark.svg" />
            </a>
          </div>
        </div>
      </transition>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { 
  useTaxesStore,
  YEAR_BUSINESS_DAYS
 } from "@/store";
import { useBreakpoint } from "@/composables/breakpoints";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useI18n } from "@/i18n";

const { showDashboard } = storeToRefs(useTaxesStore());
const { breakpoint } = useBreakpoint();
const { t } = useI18n();

const showFooterNotes = ref(false);
</script>
