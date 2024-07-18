const unslugify = (slug: string): string => {
    if (!slug) {
        return ""
    }

    return slug
        .split("-")
        .map(word => {
            if (word.length > 0) {
                return word[0]?.toUpperCase() + word.slice(1).toLowerCase()
            }
            return ""
        })
        .join(" ")
}

export default unslugify
