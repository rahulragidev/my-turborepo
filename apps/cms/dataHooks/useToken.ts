import { useAuth } from "@clerk/nextjs"
import useSWR from "swr"

const useToken = () => {
	const { getToken, userId } = useAuth()
	const res = useSWR(`user-token-${userId}`, () =>
		getToken({ template: "front_end_app" })
	)
	return res
}

export default useToken
