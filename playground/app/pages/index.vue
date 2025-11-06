<script setup lang="ts">
import type { GenerateCrossmintHostedCheckoutUrlOptions } from '@belongnet/crossmint-sdk-modal-less'
import { generateCrossmintPaymentUrl } from '@belongnet/crossmint-sdk-modal-less'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

type LaunchTarget = 'popup' | 'new-tab' | 'same-tab'

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
const iframeSrc = ref('')
const launchTarget = ref<LaunchTarget>('popup')
const launchTargetOptions: LaunchTarget[] = ['popup', 'new-tab', 'same-tab']
const incomingEvents = ref<Array<{
  eventName: string
  payload: unknown
  receivedAt: string
}>>([])

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

  const resolvedTarget: LaunchTarget
    = (payload.appearance?.display as LaunchTarget | undefined)
      ?? 'popup'
  launchTarget.value = resolvedTarget
  const hostedCheckoutPayload: GenerateCrossmintHostedCheckoutUrlOptions = {
    ...payload,
    appearance: {
      ...payload.appearance,
      display: resolvedTarget,
    },
  }
  state.url = generateCrossmintPaymentUrl(
    hostedCheckoutPayload,
  )
}

function launchCheckout(target: LaunchTarget | 'iframe') {
  state.error = ''
  state.busy = true
  iframeSrc.value = ''

  try {
    updateUrl()

    if (state.url && typeof window !== 'undefined') {
      if (target === 'iframe') {
        iframeSrc.value = state.url
      }
      else if (target === 'same-tab') {
        window.location.assign(state.url)
      }
      else if (target === 'new-tab') {
        window.open(state.url, '_blank')
      }
      else {
        // Keep opener available so checkout popups can postMessage back
        window.open(state.url, '_blank', 'width=480,height=760')
      }
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

watch(
  launchTarget,
  (target) => {
    try {
      const payload = JSON.parse(payloadInput.value) as GenerateCrossmintHostedCheckoutUrlOptions
      payload.appearance = {
        ...payload.appearance,
        display: target,
      }
      const updated = JSON.stringify(payload, null, 2)
      if (updated !== payloadInput.value) {
        payloadInput.value = updated
      }
    }
    catch {
      // Ignore invalid JSON while user is editing
    }
  },
)
const { copy, copied } = useClipboard()

const allowedOrigin = computed(() => {
  if (!state.url) {
    return null
  }

  try {
    return new URL(state.url).origin
  }
  catch {
    return null
  }
})

function handleIncomingMessage(event: MessageEvent) {
  if (!allowedOrigin.value || event.origin !== allowedOrigin.value) {
    return
  }

  // eslint-disable-next-line no-console
  console.log(event)

  const incoming = event.data as { event?: string, data?: unknown }

  if (!incoming?.event) {
    return
  }

  incomingEvents.value.unshift({
    eventName: incoming.event,
    payload: incoming.data,
    receivedAt: new Date().toLocaleTimeString(),
  })

  if (incomingEvents.value.length > 25) {
    incomingEvents.value.pop()
  }
}

function clearEvents() {
  incomingEvents.value = []
}

onMounted(() => window.addEventListener('message', handleIncomingMessage))
onBeforeUnmount(() => window.removeEventListener('message', handleIncomingMessage))
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

          <section class="space-y-2 text-xs uppercase tracking-widest">
            <div class="flex items-center justify-between text-slate-400">
              <span>Launch target</span>
              <span class="text-[10px] normal-case text-slate-500">
                Synced with payload JSON
              </span>
            </div>
            <USelect
              v-model="launchTarget"
              :items="launchTargetOptions"
            />
          </section>

          <div class="flex flex-wrap gap-3">
            <UButton
              v-if="launchTarget === 'new-tab'"
              block
              color="primary"
              size="lg"
              icon="i-heroicons-arrow-top-right-on-square"
              :loading="state.busy"
              :disabled="Boolean(state.error)"
              @click="launchCheckout('new-tab')"
            >
              Open in new tab
            </UButton>

            <UButton
              v-if="launchTarget === 'popup'"
              block
              color="primary"
              variant="soft"
              size="lg"
              icon="i-heroicons-square-3-stack-3d"
              :loading="state.busy"
              :disabled="Boolean(state.error)"
              @click="launchCheckout('popup')"
            >
              Open sized popup
            </UButton>

            <UButton
              v-if="launchTarget === 'same-tab'"
              block
              color="primary"
              variant="outline"
              size="lg"
              icon="i-heroicons-arrow-uturn-left"
              :loading="state.busy"
              :disabled="Boolean(state.error)"
              @click="launchCheckout('same-tab')"
            >
              Open in same tab
            </UButton>

            <UButton
              block
              color="secondary"
              size="lg"
              icon="i-heroicons-rectangle-group"
              :loading="state.busy"
              :disabled="Boolean(state.error)"
              @click="launchCheckout('iframe')"
            >
              Display inside iframe
            </UButton>
          </div>

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

        <section
          v-if="iframeSrc"
          class="space-y-2"
        >
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Iframe preview
          </p>

          <div class="overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
            <iframe
              :src="iframeSrc"
              class="h-[620px] w-full border-0 bg-white"
              title="Crossmint checkout preview"
            />
          </div>
        </section>

        <section
          v-if="incomingEvents.length"
          class="space-y-2"
        >
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Incoming events
            </p>
            <UButton
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-heroicons-trash"
              @click="clearEvents()"
            >
              Clear log
            </UButton>
          </div>

          <div class="space-y-3">
            <UCard
              v-for="(event, index) in incomingEvents"
              :key="index"
              variant="subtle"
              class="text-xs"
            >
              <template #header>
                <div class="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                  <span>{{ event.receivedAt }}</span>
                  <span class="font-semibold text-slate-200">{{ event.eventName }}</span>
                </div>
              </template>

              <pre class="overflow-auto whitespace-pre-wrap">
{{ event.payload ? JSON.stringify(event.payload, null, 2) : 'No payload' }}
              </pre>
            </UCard>
          </div>
        </section>
      </div>
    </UCard>
  </UContainer>
</template>
