import { BaseUrls, PaymentMethod } from '@crossmint/client-sdk-base'
import type {
  CrossmintPayButtonProps,
  SigninMethods,
  Currency,
  Locale,
} from '@crossmint/client-sdk-base'

export const LIB_VERSION = '1.1.8'

// https://github.com/Crossmint/crossmint-sdk/blob/020f634e008fb4ac00ec7ec11892629f6a4d469e/packages/client/base/src/services/hosted/crossmintModalService.ts#L6
type MintQueryParams = {
  clientId: string
  projectId?: string
  mintTo?: string
  emailTo?: string
  listingId?: string
  clientName: string
  clientVersion: string
  mintConfig?: string
  whPassThroughArgs?: string
  paymentMethod?: PaymentMethod
  preferredSigninMethod?: SigninMethods
  prepay?: string
  locale: Locale
  currency: Currency
  successCallbackURL?: string
  failureCallbackURL?: string
  checkoutProps?: string
}

const defaultProps: CrossmintPayButton = {
  className: '',
  theme: 'dark',
  disabled: false,
  tabIndex: 0,
  mintTo: '',
  emailTo: '',
  listingId: '',
  clientId: '',
  collectionId: '',
  auctionId: '',
  environment: '',
  showOverlay: true,
  whPassThroughArgs: undefined,
  paymentMethod: undefined,
  preferredSigninMethod: undefined,
  dismissOverlayOnClick: false,
  prepay: false,
  locale: 'en-US',
  currency: 'usd',
  successCallbackURL: '',
  failureCallbackURL: '',
  loginEmail: '',
  getButtonText: undefined,
  clientName: '',
  checkoutProps: {
    experimental: false,
    display: 'same-tab',
    paymentMethods: ['fiat', 'ETH', 'SOL'],
    delivery: 'all',
  },
}

type CrossmintPayButton = CrossmintPayButtonProps & {
  clientId: string
  clientName: string
  locale: Locale
  currency: Currency
}

// https://github.com/Crossmint/crossmint-sdk/blob/020f634e008fb4ac00ec7ec11892629f6a4d469e/packages/client/base/src/services/hosted/crossmintModalService.ts#L159
function getMintQueryParams(props: CrossmintPayButton) {
  const {
    mintTo,
    emailTo,
    listingId,
    whPassThroughArgs,
    paymentMethod,
    preferredSigninMethod,
    prepay,
    checkoutProps,
    clientId,
    clientName,
    locale,
    currency,
    mintConfig,
    successCallbackURL,
    failureCallbackURL,
    projectId,
  } = props

  const mintQueryParams: MintQueryParams = {
    clientId,
    clientName,
    clientVersion: LIB_VERSION,
    locale,
    currency: currency.toLowerCase() as Currency,
  }

  if (mintConfig) mintQueryParams.mintConfig = JSON.stringify(mintConfig)
  if (mintTo) mintQueryParams.mintTo = mintTo
  if (emailTo) mintQueryParams.emailTo = emailTo
  if (listingId) mintQueryParams.listingId = listingId
  if (whPassThroughArgs)
    mintQueryParams.whPassThroughArgs = JSON.stringify(whPassThroughArgs)
  if (paymentMethod)
    mintQueryParams.paymentMethod = paymentMethod.toLowerCase() as PaymentMethod
  if (preferredSigninMethod)
    mintQueryParams.preferredSigninMethod = preferredSigninMethod
  if (prepay) mintQueryParams.prepay = 'true'
  if (successCallbackURL)
    mintQueryParams.successCallbackURL = successCallbackURL
  if (failureCallbackURL)
    mintQueryParams.failureCallbackURL = failureCallbackURL
  if (projectId) mintQueryParams.projectId = projectId
  if (checkoutProps && checkoutProps.experimental === true)
    mintQueryParams.checkoutProps = JSON.stringify(checkoutProps)

  return new URLSearchParams(mintQueryParams).toString()
}

/**
 * Generates a Crossmint payment URL
 * @param props - The props to generate the URL
 * @returns The generated URL
 * @example
 * ```ts
 * const url = generateCrossmintPaymentUrl({
 *  clientId: 'your-client-id',
 *  mintTo: '0x1234',
 *  listingId: 'your-listing-id',
 *  clientName: 'your-client-name',
 *  locale: 'en-US',
 *  currency: 'usd',
 * })
 * ```
 */
export function generateCrossmintPaymentUrl(props: CrossmintPayButtonProps) {
  // const collectionOrClientId = v.parse(CollectionOrClientId, props);

  // https://github.com/Crossmint/crossmint-sdk/blob/020f634e008fb4ac00ec7ec11892629f6a4d469e/packages/client/base/src/types/index.ts#L12
  const urlOrigin =
    props.environment === 'production'
      ? BaseUrls.prod
      : props.environment === 'staging'
        ? BaseUrls.staging
        : BaseUrls.dev

  const props_: CrossmintPayButton = {
    ...defaultProps,
    ...(props as unknown as CrossmintPayButton),
  }

  const url = `${urlOrigin}/checkout?${getMintQueryParams(props_)}`

  return url
}
