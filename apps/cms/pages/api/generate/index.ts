import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = "edge"

export default async function POST(req: Request): Promise<Response> {
	if (
		process.env.NODE_ENV !== "development" &&
		process.env.KV_REST_API_URL &&
		process.env.KV_REST_API_TOKEN
	) {
		const ip = req.headers.get("x-forwarded-for")
		const ratelimit = new Ratelimit({
			redis: kv,
			limiter: Ratelimit.slidingWindow(50, "1 d"),
		})

		const { success, limit, reset, remaining } = await ratelimit.limit(
			`lokus_ratelimit_${ip}`
		)

		if (!success) {
			return new Response("You have reached your request limit for the day.", {
				status: 429,
				headers: {
					"X-RateLimit-Limit": limit.toString(),
					"X-RateLimit-Remaining": remaining.toString(),
					"X-RateLimit-Reset": reset.toString(),
				},
			})
		}
	}

	const { systemPrompt, prompt } = await req.json()

	// remove trailing slash,
	// slice the content from the end to prioritize later characters
	const content = prompt.replace(/\/$/, "").slice(-5000)

	const response = await openai.createChatCompletion({
		model: "gpt-4",
		messages: [
			{
				role: "system",
				content:
					systemPrompt ||
					"You are an AI writing assistant that continues existing text based on context from prior text. " +
						"Give more weight/priority to the later characters than the beginning ones." +
						"Limit your response to no more than 500 characters, but make sure to construct complete sentences." +
						"You're not a chat assistant so you never say how can I help you or anything related to that." +
						"You're embedded as an API to autocomplete in a text editor.",
				// we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
				// "Use Markdown formatting when appropriate.",
			},
			{
				role: "user",
				content,
			},
		],
		temperature: 0.7,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		stream: true,
		n: 1,
		//  user can have the email / userid / username
		user: "Lokus",
	})

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response)
	// console.log(`stream: ${stream.getReader().read()}`)

	// Respond with the stream
	return new StreamingTextResponse(stream)
}
