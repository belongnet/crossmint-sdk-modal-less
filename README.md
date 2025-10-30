# crossmint-sdk-modal-less

[![npm version](https://img.shields.io/npm/v/%40belongnet%2Fcrossmint-sdk-modal-less)](https://www.npmjs.com/package/@belongnet/crossmint-sdk-modal-less)

Generates a link for your custom pop-up implementation of the checkout process using the [Crossmint Hosted Checkout (pop-up) v3](https://docs.crossmint.com/payments/pay-button/overview).


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

## Migration guide 

### Upgrade to V3

1. Upgrade version to v3

```ts
pnpm install @belongnet/crossmint-sdk-modal-less@3
```

2. Update your properties for the new V3 API — see the [migration guide](https://docs.crossmint.com/payments/pay-button/upgrade/v3) for details.


```diff
generateCrossmintPaymentUrl({
- collectionId: 'your-collection-id',
+ collectionLocator: 'crossmint:your-collection-id',
  // and etc.
})
```

If you need to refer to the previous integration flow, please check the [legacy version of the documentation](https://github.com/belongnet/crossmint-sdk-modal-less/blob/3cf3b5c983ce70a1baab59a7b69b6a8b6544c74c/README.md).

## License

This project is licensed under the terms of the [MIT license](LICENSE).
