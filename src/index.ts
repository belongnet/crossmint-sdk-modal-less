import type { CrossmintHostedCheckoutV3Props } from '@crossmint/client-sdk-base'
import { validateApiKeyAndGetCrossmintBaseUrl } from '@crossmint/common-sdk-base'

// Matches packages/client/base/package.json
export const LIB_VERSION = '1.7.2'

const SDK_DEFAULT_NAME = '@crossmint/headless-hosted-checkout'

const DEFAULT_SDK_METADATA = {
  name: SDK_DEFAULT_NAME,
  version: LIB_VERSION,
}

export type HostedCheckoutSdkMetadata = Partial<typeof DEFAULT_SDK_METADATA>

export type GenerateCrossmintHostedCheckoutUrlOptions =
  CrossmintHostedCheckoutV3Props & {
    apiKey: string
    overrideBaseUrl?: string
    sdkMetadata?: HostedCheckoutSdkMetadata
  }

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

// Mirrors packages/client/base/src/utils/appendObjectToQueryParams.ts
function appendObjectToQueryParams<T extends Record<string, any>>(
  queryParams: URLSearchParams,
  props: T,
) {
  for (const [key, value] of Object.entries(props)) {
    if (!value || typeof value === 'function') {
      continue
    }

    if (typeof value === 'object') {
      queryParams.append(
        key,
        JSON.stringify(value, (_, val) => (typeof val === 'function' ? 'function' : val)),
      )
    } else if (typeof value === 'string') {
      if (value === 'undefined') {
        continue
      }
      queryParams.append(key, value)
    } else if (['boolean', 'number'].includes(typeof value)) {
      queryParams.append(key, value.toString())
    }
  }
}

/**
 * Generates a Crossmint hosted checkout URL (v3)
 * Mirrors the logic in crossmintHostedCheckoutV3Service without requiring the UI layer.
 */
export function generateCrossmintPaymentUrl(
  options: GenerateCrossmintHostedCheckoutUrlOptions,
) {
  const { apiKey, overrideBaseUrl, sdkMetadata, ...hostedCheckoutProps } = options

  if (!apiKey) {
    throw new Error('apiKey is required to generate the Crossmint hosted checkout URL')
  }

  const baseUrl = normalizeBaseUrl(
    overrideBaseUrl ?? validateApiKeyAndGetCrossmintBaseUrl(apiKey),
  )
  // Path copied from packages/client/base/src/services/hosted/v3/crossmintHostedCheckoutV3Service.ts
  const urlWithPath = `${baseUrl}/sdk/2024-03-05/hosted-checkout`

  const queryParams = new URLSearchParams()
  appendObjectToQueryParams(queryParams, hostedCheckoutProps)
  queryParams.append('apiKey', apiKey)

  const resolvedMetadata = {
    ...DEFAULT_SDK_METADATA,
    ...sdkMetadata,
  }

  queryParams.append('sdkMetadata', JSON.stringify(resolvedMetadata))

  return `${urlWithPath}?${queryParams.toString()}`
}
