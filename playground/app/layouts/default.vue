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
          Crossmint Modal-less Playground
        </h1>
        <p class="text-sm">
          Minimal example. Click the button to open a test checkout and get the generated URL.
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
