/* eslint-disable prettier/prettier */
import CustomPricingEmailTemplate from "components/CustomPricingEmailTemplate"
import type { NextApiRequest, NextApiResponse } from "next"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { email, firstName } = req.query
		console.log(`Email trigger to ${email} with name ${firstName}`)

		const data = await resend.emails.send({
			from: "Lokus <support@lokus.io>",
			reply_to: "Lokus <praneeth@lokus.io>",
			to: [email as string],
			subject: "Lokus Custom Pricing Request",
			react: CustomPricingEmailTemplate({ name: firstName as string }),
		})

		console.log(`Data: \n ${JSON.stringify(data)}}`)

		res.status(200).json(data)
	} catch (error) {
		res.status(400).json(error)
	}
}
