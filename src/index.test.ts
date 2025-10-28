import { describe, expect, test, vi } from 'vitest'
import type { GenerateCrossmintHostedCheckoutUrlOptions } from './index.js'

vi.mock('@crossmint/common-sdk-base', () => ({
  validateApiKeyAndGetCrossmintBaseUrl: () => 'https://staging.crossmint.com',
}))

const { generateCrossmintPaymentUrl } = await import('./index.js')

function createPayload() {
  return {
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
    apiKey: 'ck_staging_REDACTED',
    sdkMetadata: {
      name: '@crossmint/client-sdk-react-ui',
      version: '1.19.13',
    },
  } satisfies GenerateCrossmintHostedCheckoutUrlOptions
}

describe('generateCrossmintPaymentUrl', () => {
  test('generates a hosted checkout v3 URL using the working payload', () => {
    const payload = createPayload()
    const url = new URL(generateCrossmintPaymentUrl(payload))

    expect(`${url.origin}${url.pathname}`).toBe(
      'https://staging.crossmint.com/sdk/2024-03-05/hosted-checkout',
    )

    expect(url.searchParams.get('apiKey')).toBe(payload.apiKey)
    expect(JSON.parse(url.searchParams.get('recipient') ?? '')).toEqual(payload.recipient)
    expect(JSON.parse(url.searchParams.get('lineItems') ?? '')).toEqual(payload.lineItems)
    expect(JSON.parse(url.searchParams.get('payment') ?? '')).toEqual(payload.payment)
    expect(JSON.parse(url.searchParams.get('appearance') ?? '')).toEqual(payload.appearance)

    const metadata = JSON.parse(url.searchParams.get('sdkMetadata') ?? '{}')
    expect(metadata.name).toBe(payload.sdkMetadata.name)
    expect(metadata.version).toBe(payload.sdkMetadata.version)
  })

  test('throws when the API key is missing', () => {
    const payload = createPayload()

    expect(() =>
      generateCrossmintPaymentUrl({
        ...payload,
        apiKey: '',
      }),
    ).toThrow('apiKey is required to generate the Crossmint hosted checkout URL')
  })
})
