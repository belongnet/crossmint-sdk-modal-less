import { expect, test } from 'vitest'
import { generateCrossmintPaymentUrl } from './index.js'

test('simple test url generation', () => {
  expect(
    generateCrossmintPaymentUrl({
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
  ).toBe(
    'http://localhost:3001/checkout?clientId=&clientName=&clientVersion=1.1.8&locale=en-US&currency=usd&mintConfig=%7B%22type%22%3A%22erc-721%22%2C%22totalPrice%22%3A%220.001%22%2C%22_quantity%22%3A%221%22%7D&successCallbackURL=https%3A%2F%2Fexample.com%2Fsuccess&failureCallbackURL=https%3A%2F%2Fexample.com%2Ffailure&projectId=_YOUR_PROJECT_ID_'
  )
})

test('full test url generation', () => {
  expect(
    generateCrossmintPaymentUrl({
      collectionId: '76be223b-60cd-4fe0-9e4b-dffe5df11e4c',
      paymentMethod: 'fiat',
      clientId: '76be223b-60cd-4fe0-9e4b-dffe5df11e4c',
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
      successCallbackURL:
        'https://localhost:8100/payments?target=event-ticket&eventId=661e72f5406bf8078792b4ab',
      failureCallbackURL:
        'https://localhost:8100/payments?target=event-ticket&eventId=661e72f5406bf8078792b4ab',
    })
  ).toBe(
    'https://staging.crossmint.com/checkout?clientId=76be223b-60cd-4fe0-9e4b-dffe5df11e4c&clientName=&clientVersion=1.1.8&locale=en-US&currency=usd&mintConfig=%7B%22totalPrice%22%3A%220.005%22%2C%22reciever%22%3A%220xaae640a40cff7841afea3b5917da67ebe7aec2bf%22%2C%22tokenId%22%3A%22516%22%2C%22tokenUri%22%3A%22https%3A%2F%2Ffoster-images.s3.us-east-1.amazonaws.com%2Fup%2Fassets%2Fnft%2F0x441858547552f7238d79662a98b3ea8f49add2fb%2F516.json%22%2C%22whitelisted%22%3Afalse%2C%22signature%22%3A%220x13f23d3c7e1c0%22%2C%22_expectedMintPrice%22%3A%225000000000000000%22%2C%22_expectedPayingToken%22%3A%220xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE%22%7D&mintTo=0xaae640a40cff7841afea3b5917da67ebe7aec2bf&emailTo=example%40mail.com&paymentMethod=fiat&successCallbackURL=https%3A%2F%2Flocalhost%3A8100%2Fpayments%3Ftarget%3Devent-ticket%26eventId%3D661e72f5406bf8078792b4ab&failureCallbackURL=https%3A%2F%2Flocalhost%3A8100%2Fpayments%3Ftarget%3Devent-ticket%26eventId%3D661e72f5406bf8078792b4ab&projectId=b6e12fa9-f0ac-4e73-9234-9410f8aa114b&checkoutProps=%7B%22experimental%22%3Atrue%2C%22paymentMethods%22%3A%5B%22fiat%22%5D%2C%22display%22%3A%22same-tab%22%7D'
  )
})
