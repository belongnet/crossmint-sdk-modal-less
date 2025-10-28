# crossmint-sdk-modal-less

Generates a link for your custom pop-up implementation of the checkout process using the [Crossmint Pay Button](https://docs.crossmint.com/nft-checkout/pay-button/overview).

## Installation

```bash
pnpm add @belongnet/crossmint-sdk-modal-less
```

## Usage

```ts
import { generateCrossmintPaymentUrl } from '@belongnet/crossmint-sdk-modal-less'

const crossmintPaymentUrl = generateCrossmintPaymentUrl({
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
})

// your modal implementation
const modal = window.open(crossmintPaymentUrl, '_blank')

// close the modal
modal.close()
```

## License

This project is licensed under the terms of the [MIT license](LICENSE).
