const slugify = (name: string): string => {
    return name
        .toLowerCase() // convert to lowercase
        .replaceAll(/[^a-z-]/g, "") // keep only alphabets and hyphens
        .replaceAll(/-+/g, "-") // replace multiple - with single -
        .replaceAll(/^-+|-+$/g, "") // remove leading and trailing hyphens
}

export default slugify
