import Stripe from "stripe"

export interface IPlan {
	id: string
	name: string
	description: string | null
	prices: {
		id: string
		amount: number | null
		interval: Stripe.Price.Recurring.Interval | null
	}[]
}
