import { Node } from "@tiptap/core"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { PagesResponse } from "@repo/cms/types/generated/types"

// interface FeaturedBlogsSectionProps {
//	// Define the props for your FeaturedBlogsSectionComponent here
//	editor: Editor
// }

type SetFeaturedPagesOptions = {
    // Define the options for setting the featured pages here
    layout?: "grid" | "list"
}

declare module "@tiptap/core" {
    // eslint-disable-next-line
    interface Commands<ReturnType> {
        featuredPages: {
            /**
             * Insert featuredPages section
             */
            // eslint-disable-next-line no-unused-vars
            setFeaturedPages: (options?: SetFeaturedPagesOptions) => ReturnType
        }
    }
}

const GET_FEATURED_BLOGS_BY_SITEID = gql`
    query Query($siteId: String!, $filter: PageFilterEnum) {
        data: getFeaturedPagesBySite(siteId: $siteId, filter: $filter) {
            success
            message
            data {
                id
                isFeatured
                isPublic
                lastPublishedAt
                name
                slug
            }
        }
    }
`

const FeaturedBlogsSectionExtension = Node.create({
    name: "featured-blogs",

    group: "block",

    content: "block*",

    onCreate() {
        console.log("FeaturedBlogsSectionExtension created")
    },

    parseHTML() {
        return [
            {
                tag: '*[data-type="featured-blogs"]'
            }
        ]
    },

    renderHTML() {
        return ["div", { "data-type": "featured-blogs" }, 0]
    },

    addCommands() {
        return {
            setFeaturedPages: (_options?: SetFeaturedPagesOptions) => () => {
                const fetchAndUpdateContent = async () => {
                    try {
                        const siteId =
                            typeof this.editor.options?.editorProps
                                ?.attributes === "object"
                                ? (this.editor.options.editorProps.attributes
                                      .siteId as string)
                                : ""
                        const token =
                            typeof this.editor.options?.editorProps
                                ?.attributes === "object"
                                ? (this.editor.options.editorProps?.attributes
                                      ?.token as string)
                                : ""

                        console.log(
                            "fetchFeaturedBlogs called with",
                            token,
                            siteId
                        )

                        const response = await fetchWithToken<
                            GraphQLResponse<PagesResponse>
                        >({
                            query: GET_FEATURED_BLOGS_BY_SITEID,
                            variables: { siteId },
                            token
                        })

                        const featuredBlogs = response?.data?.data || []
                        console.log("received featuredBlogs", featuredBlogs)
                        const contentObjects = featuredBlogs.flatMap(blog => [
                            {
                                type: "featured-card-node",
                                attrs: {
                                    name: blog.name,
                                    slug: blog.slug,
                                    featured: true,
                                    description: blog?.metaDescription || "",
                                    bannerImage: blog.bannerImage
                                }
                            },
                            {
                                type: "paragraph",
                                content: []
                            }
                        ])
                        console.log("contentObjects", contentObjects)

                        const content = {
                            type: this.name,
                            content: [
                                {
                                    type: "heading",
                                    attrs: {
                                        level: 2
                                    },
                                    content: [
                                        {
                                            type: "text",
                                            text: "Featured Blogs"
                                        }
                                    ]
                                },
                                {
                                    type: "paragraph",
                                    content: []
                                },
                                ...contentObjects
                            ]
                        }

                        console.log("content", content)

                        this.editor.commands.insertContent(content)
                    } catch (error) {
                        console.error("Error fetching featured blogs:", error)
                    }
                }

                fetchAndUpdateContent()

                return true
            }
        }
    }
})

export default FeaturedBlogsSectionExtension
