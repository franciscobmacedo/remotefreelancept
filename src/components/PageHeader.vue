<template>
  <header class="sticky top-0 z-50 bg-defaultbg">
    <nav class="flex justify-between items-center px-5">
      <div class="flex items-center justify-start gap-5">
        <router-link class="flex items-center justify-center space-x-3" to="/">
          <img src="@/assets/world.svg" class="h-7" />
          <span> simulator </span>
        </router-link>
        <router-link
          v-if="store.hasStoredSimulations"
          data-cy="simulations-menu"
          class="flex items-center justify-center space-x-3"
          to="/simulations"
        >
          <span> simulations ({{ store.storedSimulationsCount }}) </span>
        </router-link>
        <router-link class="flex items-center justify-center" to="/about">
          about
        </router-link>
      </div>
      <div>
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
const { breakpoint } = useBreakpoint();

const store = useTaxesStore();
store.loadSimulations();
</script>
