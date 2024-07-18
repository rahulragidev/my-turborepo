const slugify = (string: string, maxLength?: number) => {
	let slug = string
		.toLowerCase() // convert to lowercase
		.replaceAll(/[^a-z-]/g, "") // keep only alphabets and hyphens
		.replaceAll(/-+/g, "-") // replace multiple - with single -
		.replaceAll(/^-+|-+$/g, "") // remove leading and trailing hyphens

	if (maxLength) {
		slug = slug.substring(0, maxLength) // apply max length
	}
	return slug
}

export default slugify
