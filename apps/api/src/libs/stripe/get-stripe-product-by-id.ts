import Stripe from "stripe"

import { StripePrice } from "entities/template/types/stripe-price.type"
import { stripe } from "utils/stripe"

const getStripeProductById = async (
    id: string
): Promise<Stripe.Response<
    Stripe.Product & { prices?: StripePrice[] }
> | null> => {
    try {
        console.log(`Get Stripe Product by Id called with priceId: ${id}`)
        const response = await stripe.products.retrieve(id, {
            expand: ["default_price"]
        })
        console.log(`Received Response: ${JSON.stringify(response, null, 2)}`)
        return response
        // const prices = await stripe.prices.list({ product: id })
        // if (prices.data) {
        //     return {
        //         ...response,
        //         prices: prices.data
        //     }
        // }
        // return {
        //     ...response
        // }
    } catch (error) {
        console.log(`getStripeProductById error: ${error}`)
        return null
    }
}

export default getStripeProductById
