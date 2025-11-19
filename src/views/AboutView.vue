<template>
  <div class="flex h-screen">
    <div class="m-auto p-10">
      <p v-html="t.aboutText"></p>
      <div class="flex justify-center my-2">
        <router-link
          to="/"
          class="hover:text-neutral-600 hover:decoration-neutral-600 p-3 b-3 underline underline-offset-4"
          >{{ t.goToSimulator }}</router-link
        >
        <a
          target="_blank"
          href="https://github.com/franciscobmacedo/remotefreelancept/"
          class="hover:text-neutral-600 hover:decoration-neutral-600 p-3 b-3 underline underline-offset-4"
          >{{ t.contribute }}</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "@/i18n";
const { t } = useI18n();
</script>
