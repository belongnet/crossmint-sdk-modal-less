<script lang="ts" setup>
import { ref } from 'vue'

const footerItems = ref([
  {
    label: 'cm',
    slot: 'cm',
    as: 'div',
  },
  {
    label: '',
    to: 'https://belong.net/',
    slot: 'belong',
  },
  {
    icon: 'i-simple-icons-github',
    to: 'https://github.com/belongnet/crossmint-sdk-modal-less',
    target: '_blank',
  },
])
</script>

<template>
  <div class="app">
    <header class="mt-4">
      <div class="mb-10 space-y-3 text-center">
        <h1 class="text-3xl font-semibold">
          Crossmint Hosted Checkout (pop-up) Playground
        </h1>

        <p class="text-sm">
          for
          <ULink
            to="https://docs.crossmint.com/payments/pay-button/upgrade/v3"
            target="_blank"
          >
            Crossmint v3 Hosted (migration guide) <UIcon name="i-heroicons-arrow-top-right-on-square" />
          </ULink>
        </p>
      </div>
    </header>

    <UContainer
      as="main"
    >
      <slot />
    </UContainer>

    <footer class="my-10">
      <UNavigationMenu
        :items="footerItems"
        class="justify-center"
        variant="link"
      >
        <template #belong>
          {{ new Date().getFullYear() }} &copy; Belong.net
        </template>
        <template #cm>
          <ColorModeButton />
        </template>
      </UNavigationMenu>
    </footer>
  </div>
</template>
