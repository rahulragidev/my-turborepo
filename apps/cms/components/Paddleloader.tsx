/* eslint-disable no-undef */
// @ts-nocheck
import { useRouter } from "next/router"
import Script from "next/script"

const PaddleLoader = () => {
	const router = useRouter()
	return (
		<Script
			src="https://cdn.paddle.com/paddle/paddle.js"
			onLoad={() => {
				// @ts-ignore TODO: Remove in Production
				Paddle.Environment.set("sandbox")
				// @ts-ignore
				Paddle.Setup({
					vendor: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
					eventCallback(data: any) {
						console.log("Paddle Event", data.event)
						//  data.event will specify the event type
						if (data.event === "Checkout.Complete") {
							console.log("Checkout success", data.eventData)
							router.push(`/checkout/success`)
						} else if (data.event === "Checkout.Close") {
							console.log("Checkout failed", data.eventData)
							Padddle.close()
						}
					},
				})
			}}
		/>
	)
}

export default PaddleLoader
