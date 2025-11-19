<template>
  <header class="sticky top-0 z-50 bg-defaultbg">
    <nav class="flex justify-between items-center px-5">
      <div class="flex items-center justify-start gap-5">
        <router-link class="flex items-center justify-center space-x-3" to="/">
          <img src="@/assets/world.svg" class="h-7" />
          <span> {{ t.simulator }} </span>
        </router-link>
        <router-link
          v-if="store.hasStoredSimulations"
          data-cy="simulations-menu"
          class="flex items-center justify-center space-x-3"
          to="/simulations"
        >
          <span> {{ t.simulations }} ({{ store.storedSimulationsCount }}) </span>
        </router-link>
        <router-link class="flex items-center justify-center" to="/comparison">
          {{ t.comparison }}
        </router-link>
        <router-link class="flex items-center justify-center" to="/about">
          {{ t.about }}
        </router-link>
      </div>
      <div class="flex items-center gap-4">
        <!-- Language Selector -->
        <div class="flex bg-gray-200 rounded-lg p-1">
          <button 
            @click="setLanguage('pt')" 
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            :class="currentLanguage === 'pt' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
          >
            🇵🇹 PT
          </button>
          <button 
            @click="setLanguage('en')" 
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            :class="currentLanguage === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
          >
            🇬🇧 EN
          </button>
        </div>

        <a
          v-if="breakpoint.mdAndUp"
          className="cursor-pointer p-3"
          target="_blank"
          href="https://github.com/franciscobmacedo/remotefreelancept"
        >
          <img src="@/assets/github-mark.svg" class="h-7" />
        </a>
      </div>
    </nav>
  </header>
</template>
<script lang="ts" setup>
import { useTaxesStore } from "@/store";
import { useBreakpoint } from "@/composables/breakpoints";
import { useI18n } from "@/i18n";

const { breakpoint } = useBreakpoint();
const { t, setLanguage, currentLanguage } = useI18n();

const store = useTaxesStore();
store.loadSimulations();
</script>
