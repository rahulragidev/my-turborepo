/**
 *
 * @param {*} req
 * @param {*} res
 * In general, browsers cache JS code. R
 * etrieving the public key from an endpoint makes it easier to update our key (in case we ever need to) on applications.
 * This especially applies for building for mobile clients where the public key shouldn't be embedded
 * into the app’s source. Hence, we pull these from on the server.
 */

export default function handler(req, res) {
	if (req.method === "GET") {
		res.status(200).json({ key: process.env.STRIPE_PUBLISHABLE_KEY })
	} else {
		res.status(405).end("Method not allowed")
	}
}
