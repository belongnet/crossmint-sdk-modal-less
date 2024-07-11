// import * as v from 'valibot';
// import { type FiatEmbeddedCheckoutProps } from "@crossmint/client-sdk-base";

// export const CrossmintPaymentServiceSchema = v.object<FiatEmbeddedCheckoutProps>({
//     projectId: v.string(),
//     environment: v.string(),
//     clientId: v.string(),
//     collectionId: v.string(),
//     paymentMethod: v.literal('fiat'),
//     cardWalletPaymentMethods: v.optional(v.union(v.literal('apple-pay'), v.literal('google-pay')), ),
//     emailInputOptions: v.optional(
//         v.union(
//             v.object({
//                 show: v.literal(true),
//                 useStripeLink: v.optional(v.boolean())
//             }),
//             v.object({
//                 show: v.literal(false)
//             })
//         )
//     ),
//     experimental: v.optional(
//         v.object({
//             useCardWalletEmail: v.optional(v.boolean())
//         })
//     ),
//     currency: v.optional(v.string()),
//     locale: v.optional(v.string()),
//     uiConfig: v.optional(v.any()),
//     whPassThroughArgs: v.optional(v.any()),
//     recipient: v.optional(
//         v.object({
//             email: v.optional(v.string()),
//             wallet: v.optional(v.string())
//         })
//     ),
//     onEvent: v.optional(v.function()),
//     debug: v.optional(v.boolean())
// });