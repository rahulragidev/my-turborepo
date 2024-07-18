"use client"

import { createContext } from "react"

const NovelContext = createContext<{
	completionApi: string
}>({
	completionApi: "/api/generate",
})

export default NovelContext
