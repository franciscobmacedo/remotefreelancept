<template>
  <footer
    class="
      fixed
      bottom-0
      w-full
      py-5
      md:py-2
      left-0
      text-center
      border-t-[1px] border-neutral-200
      bg-neutral-100
      overflow-scroll
      max-h-24
    "
  >
    <div
      class="
        flex flex-col
        sm:flex-row
        justify-around
        items-center
        space-y-3
        sm:space-y-0
      "
    >
      <div class="text-xs">
        *Assuming 248 business days in a year and 22 business days in a month.
      </div>
      <div class="text-xs">
        This is only valid for independent workers with green receipts
        (trabalhadores independentes com recibos verdes).
      </div>
      <div class="text-xs">
        VAT (IVA) is ignored (only for foreign clients).
      </div>
    </div>
    <div class="flex justify-center">
      <a
        v-if="breakpoint.smAndDown"
        className="cursor-pointer text-center text-blue-500 p-3 rounded-full shadow-sm hover:shadow-xl"
        target="_blank"
        href=""
      >
        <img src="@/assets/github.png" />
      </a>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import { useBreakpoint } from "@/composables/breakpoints";
const { breakpoint } = useBreakpoint();
</script>
