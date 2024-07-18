import Stripe from "stripe";
import { stripe } from "utils/stripe";

// Fetch stripe subscription by id
const getStripeSubscriptionById = async (id: string): Promise<Stripe.Subscription> => {
    const subscription = await stripe.subscriptions.retrieve(id)
    return subscription
}

export default getStripeSubscriptionById