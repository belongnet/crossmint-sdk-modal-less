import { expect, test } from 'vitest'
import { generateCrossmintPaymentUrl } from './index.js'

test('adds 1 + 2 to equal 3', () => {
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
