// ;
import Stripe from "stripe"
import { logger } from "logger"

import { stripe } from "utils/stripe"

// Fetch stripe subscription by id
const getStripeSubscriptionByEmail = async (
    email: string
): Promise<(Stripe.Subscription & { currentPlan?: Stripe.Price }) | null> => {
    // console.log(`Looking for stripe subscription with email ${email}`)
    const subscriptions = await stripe.subscriptions.search({
        // eslint-disable-next-line no-useless-escape
        query: `metadata[\'user_email\']:'${email}\'`,
        limit: 1,
        expand: ["data.items.data.price"]
    })

    if (!subscriptions || subscriptions.data.length === 0) {
        return null
    }

    // console.log(
    //    `Found ${subscriptions.data.length} subscriptions ${JSON.stringify(
    //        subscriptions.data,
    //        null,
    //        2
    //    )}`
    // )

    // logger.debug(
    //     { subscriptions: subscriptions.data },
    //     `Found ${subscriptions.data.length} subscriptions`
    // )
    const currentPlan = subscriptions?.data[0]?.items?.data[0]?.price
    // console.log(`${JSON.stringify(subscriptions.data[0], null, 2)}`)
    // console.log(JSON.stringify(subscriptions.data[0], null, 2))
    // @ts-ignore
    return {
        ...subscriptions.data[0],
        currentPlan,
    }
}

export default getStripeSubscriptionByEmail
