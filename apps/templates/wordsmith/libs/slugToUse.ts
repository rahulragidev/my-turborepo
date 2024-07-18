export type ParamsType = {
	slug?: string | string[]
}

const slugToUse = (params: ParamsType): string => {
	if (params.slug instanceof Array) {
		// last element of the slug array
		return params.slug[params.slug.length - 1]
	} else {
		if (params.slug === undefined) {
			return "index"
		}
		return params.slug
	}
}

export default slugToUse
