import Stripe from "stripe"
import { stripeSecretKey } from "config"

export const getStripe = async () => {
    const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16"
    })
    return stripe
}
