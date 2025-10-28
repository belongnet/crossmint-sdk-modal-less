<script setup lang="ts">
import type { CrossmintPayButtonProps } from '@crossmint/client-sdk-base'
import { generateCrossmintPaymentUrl } from '@belongnet/crossmint-sdk-modal-less'

type DemoPayload = CrossmintPayButtonProps & {
  clientId: string
  clientName: string
}

const demoPayload: DemoPayload = {
  collectionId: '76be223b-60cd-4fe0-9e4b-dffe5df11e4c',
  paymentMethod: 'fiat',
  clientId: '76be223b-60cd-4fe0-9e4b-dffe5df11e4c',
  clientName: 'crossmint-sdk-modal-less/playground',
  projectId: 'b6e12fa9-f0ac-4e73-9234-9410f8aa114b',
  mintConfig: {
    totalPrice: '0.005',
    reciever: '0xaae640a40cff7841afea3b5917da67ebe7aec2bf',
    tokenId: '516',
    tokenUri:
      'https://foster-images.s3.us-east-1.amazonaws.com/up/assets/nft/0x441858547552f7238d79662a98b3ea8f49add2fb/516.json',
    whitelisted: false,
    signature: '0x13f23d3c7e1c0',
    _expectedMintPrice: '5000000000000000',
    _expectedPayingToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  },
  environment: 'staging',
  mintTo: '0xaae640a40cff7841afea3b5917da67ebe7aec2bf',
  emailTo: 'example@mail.com',
  checkoutProps: {
    experimental: true,
    paymentMethods: ['fiat'],
    display: 'same-tab',
  },
  locale: 'en-US',
  currency: 'usd',
  successCallbackURL:
    'https://localhost:8100/payments?target=event-ticket&eventId=661e72f5406bf8078792b4ab',
  failureCallbackURL:
    'https://localhost:8100/payments?target=event-ticket&eventId=661e72f5406bf8078792b4ab',
}

const payloadInput = ref(JSON.stringify(demoPayload, null, 2))

const state = reactive({
  url: '',
  error: '',
  busy: false,
})

function parsePayload() {
  return JSON.parse(payloadInput.value) as DemoPayload
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
