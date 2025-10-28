<script setup lang="ts">
import type { GenerateCrossmintHostedCheckoutUrlOptions } from '@belongnet/crossmint-sdk-modal-less'
import {

  generateCrossmintPaymentUrl,
} from '@belongnet/crossmint-sdk-modal-less'

const demoPayload: GenerateCrossmintHostedCheckoutUrlOptions = {
  recipient: {
    email: 'buyer@crossmint.com',
  },
  locale: 'en-US',
  lineItems: {
    collectionLocator: 'crossmint:6294235c-135e-4be8-a0c6-4d3f5d5ae5c4',
    callData: {
      totalPrice: '2',
    },
  },
  payment: {
    crypto: {
      enabled: true,
      defaultChain: 'base-sepolia',
      defaultCurrency: 'usdc',
    },
    fiat: {
      enabled: true,
      defaultCurrency: 'usd',
    },
    receiptEmail: 'receipt@crossmint.com',
  },
  appearance: {
    display: 'popup',
    overlay: {
      enabled: true,
    },
    theme: {
      button: 'dark',
      checkout: 'light',
    },
  },
  apiKey: 'ck_staging_26GbRg2pHpXxur9h8tFLKqT7bLDyoDojpk79DCRSdAhPtAiToZJ9kiexhULetccf47nSF933FqXK2nvLVvqiKudRJ6q5aJpcFZ8P1GWDE59Pq3Jor1HESpJ6WMqTgWybmtMu32RcJLC5SkKkfoXDD4DomwTd3vo5BiKajQMhP2SrqYDYefXbBbcxUxtoQ6vDjph17cQ1NfTHrSuuMPSp3iw',
  sdkMetadata: {
    name: '@crossmint/client-sdk-react-ui',
    version: '1.19.13',
  },
}

const payloadInput = ref(JSON.stringify(demoPayload, null, 2))

const state = reactive({
  url: '',
  error: '',
  busy: false,
})

function parsePayload(): GenerateCrossmintHostedCheckoutUrlOptions {
  return JSON.parse(payloadInput.value) as GenerateCrossmintHostedCheckoutUrlOptions
}

function updateUrl() {
  const payload = parsePayload()
  state.url = generateCrossmintPaymentUrl(payload)
}

function openCheckout() {
  state.error = ''
  state.busy = true

  try {
    updateUrl()

    if (state.url && typeof window !== 'undefined') {
      window.open(state.url, '_blank', 'noopener')
    }
  }
  catch (error) {
    state.error
      = error instanceof Error ? error.message || 'Failed to generate checkout URL' : 'Failed to generate checkout URL'
  }
  finally {
    state.busy = false
  }
}

watch(
  payloadInput,
  () => {
    try {
      state.error = ''
      updateUrl()
    }
    catch (error) {
      state.url = ''
      state.error
        = error instanceof Error ? error.message : 'Failed to generate checkout URL'
    }
  },
  { immediate: true },
)

const { copy, copied } = useClipboard()
</script>

<template>
  <UContainer>
    <UCard variant="subtle">
      <div class="space-y-6">
        <section class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Payload Editor
          </p>
          <UTextarea
            v-model="payloadInput"
            :rows="18"
            class="font-mono text-xs text-slate-200/80 w-full"
            autocomplete="off"
          />
        </section>

        <section class="space-y-4">
          <UAlert
            v-if="state.error"
            color="error"
            variant="soft"
            :title="state.error"
            icon="i-heroicons-exclamation-triangle"
          />

          <UButton
            block
            color="primary"
            size="lg"
            icon="i-heroicons-arrow-top-right-on-square"
            :loading="state.busy"
            :disabled="Boolean(state.error)"
            @click="openCheckout"
          >
            Open test checkout
          </UButton>

          <div v-if="state.url" class="rounded-lg border border-white/10 bg-white/5 p-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Generated URL

              <UButton
                :color="copied ? 'success' : 'neutral'"
                variant="soft"
                size="sm"
                :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                aria-label="Copy to clipboard"
                class="cursor-pointer float-right"
                @click="copy(state.url)"
              />
            </p>

            <code class="block break-all text-xs">

              {{ state.url }}
            </code>
          </div>

          <UAlert
            v-else
            color="primary"
            variant="soft"
            icon="i-heroicons-information-circle"
          >
            Launch a checkout session to display the URL here.
          </UAlert>
        </section>
      </div>
    </UCard>
  </UContainer>
</template>
