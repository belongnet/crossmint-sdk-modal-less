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
  amount: 100,
  currency: 'usd',
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
})

// your modal implementation
const modal = window.open(crossmintPaymentUrl, '_blank')

// close the modal
modal.close()
```

## License

This project is licensed under the terms of the [MIT license](LICENSE).
