<template>
    <div class="flex h-screen">
        <div class="m-auto p-10">
            <p>
                <strong>Remote Freelancer PT</strong> is an open source simulator for freelancers in Portugal working for
                remote
                companies. It allows you to estimate your net income and taxes to pay.
                More information soon.
            </p>
            <div class="flex justify-center my-2">
                <router-link to="/"
                    class="hover:text-neutral-600 hover:decoration-neutral-600 p-3 b-3 underline underline-offset-4">go to
                    simulator</router-link>
                <a target="_blank" href="https://github.com/franciscobmacedo/remotefreelancept/"
                    class="hover:text-neutral-600 hover:decoration-neutral-600 p-3 b-3 underline underline-offset-4">contribute</a>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
