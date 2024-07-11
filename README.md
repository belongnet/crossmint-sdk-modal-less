# crossmint-sdk-modal-less

Crossmint SDK for client and server integrations, but without modal

## Installation

```bash
pnpm add @belongnet/crossmint-sdk-modal-less
```

## Usage

### Client

```ts
import { generateCrossmintPaymentUrl } from '@belongnet/crossmint-sdk-modal-less'

const crossmintPaymentUrl = generateCrossmintPaymentUrl({
  projectId: '_YOUR_PROJECT_ID_',
  collectionId: '_YOUR_CLIENT_ID',
  mintConfig: {
    type: 'erc-721',
    totalPrice: '0.001',
    _quantity: '1',
  },
  successCallbackURL: 'https://example.com/success',
  failureCallbackURL: 'https://example.com/failure',
})

// your modal implementation
const modal = window.open(crossmintPaymentUrl, '_blank')

// close the modal
modal.close()
```

## License

This project is licensed under the terms of the [MIT license](LICENSE).
