import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16"
})

const getStripePriceById = async (
    id: string
): Promise<Stripe.Response<Stripe.Price> | null> => {
    try {
        console.log(`Get Stripe Price by Id called with priceId: ${id}`)
        const response = await stripe.prices.retrieve(id)
        console.log(`Received Response: ${JSON.stringify(response, null, 2)}`)
        return response
    } catch (error) {
        console.log(`getStripePriceById error: ${error}`)
        return null
    }
}

export default getStripePriceById
