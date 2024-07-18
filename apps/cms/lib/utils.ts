import { clsx, type ClassValue } from "clsx"
import { debounce } from "lodash"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isValidUrl(url: string) {
	try {
		const urlObj = new URL(url)
		if (!urlObj.protocol || !urlObj.hostname) {
			return false
		}
		return true
	} catch (e) {
		return false
	}
}

export function getUrlFromString(str: string) {
	if (isValidUrl(str)) return str
	try {
		if (str.includes(".") && !str.includes(" ")) {
			return new URL(`https://${str}`).toString()
		}
		return null
	} catch (e) {
		return null
	}
}

// eslint-disable-next-line import/prefer-default-export
export function asyncDebounce<F extends (..._: any[]) => Promise<any>>(
	func: F,
	wait?: number
) {
	const debounced = debounce((resolve, reject, args: Parameters<F>) => {
		func(...args)
			.then(resolve)
			.catch(reject)
	}, wait)

	return (...args: Parameters<F>): ReturnType<F> =>
		new Promise((resolve, reject) => {
			debounced(resolve, reject, args)
		}) as ReturnType<F>
}
