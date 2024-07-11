# crossmint-sdk-modal-less

Crossmint SDK for client and server integrations, but without modal

## Installation

```bash
pnpm add @belongnet/crossmint-sdk-modal-less
```

## Usage

### Client

```javascript
import { generateCrossmintPaymentUrl } from '@belongnet/crossmint-sdk-modal-less';

const url = generateCrossmintPaymentUrl({
  amount: 100,
  currency: 'usd',
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel
})

const modal = window.open(url, '_blank');

// Close the modal
modal.close();
```

## License

This project is licensed under the terms of the [MIT license](LICENSE).
