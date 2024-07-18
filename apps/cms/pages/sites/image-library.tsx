import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import LibraryUsage from "components/molecules/LibraryUsage"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ChevronLeft } from "react-iconly"
import useSWR from "swr"
import { AssetsResponse } from "types/generated/types"

const Index = () => {
	const { userId, getToken } = useAuth()
	const {
		data,
		error,
		mutate: _imagesMutate,
	} = useSWR(
		["GET_ALL_IMAGES_QUERY", userId],
		() =>
			fetchWithToken<GraphQLResponse<AssetsResponse>>({
				query: GET_ALL_IMAGES_QUERY,
				variables: {},
				getToken,
			}),
		{
			revalidateOnFocus: true,
			onError: err => {
				console.error(err)
			},
		}
	)

	if (data) {
		return (
			<div className="py-16 px-16 mx-auto space-y-4 max-w-6xl">
				<div className="flex justify-between items-end w-full">
					<div>
						<Button
							variant="tertiary"
							href="/"
							className="px-px !text-slate-500 mb-2">
							<ChevronLeft size={18} />
							Home
						</Button>
						<h1 className="text-4xl font-semibold text-white">Images</h1>
					</div>
					<LibraryUsage />
				</div>

				{/* <ImagesUploaderComponent /> */}
				{/* <ImageLibrary /> */}
			</div>
		)
	}

	if (error) {
		return (
			<>
				<h1 className="text-4xl text-white">Error</h1>
				<h2 className="text-xl text-white">{JSON.stringify(error)}</h2>
			</>
		)
	}

	return <h1>Loading...</h1>
}

export default Index

const GET_ALL_IMAGES_QUERY = gql`
	query AllMyAssets {
		data: allMyAssets {
			success
			message
			assets {
				id
				# owner
				slug
				key
				url
				size
				height
				width
				blurhash
			}
		}
	}
`
