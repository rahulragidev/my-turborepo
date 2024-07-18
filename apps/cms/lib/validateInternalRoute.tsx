import { usePathname } from "next/navigation"

const validateInternalRoute = (route: string) => {
	const pathname = usePathname()
	return pathname === route
}

export default validateInternalRoute
