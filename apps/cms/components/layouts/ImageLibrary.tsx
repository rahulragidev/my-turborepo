import BlurImage from "components/BlurImage"
import useAllAssets from "dataHooks/useAllAssets"
import { Asset } from "types/generated/types"

// const DELETE_IMAGES = gql`
// 	mutation deleteAssets($ids: [String!]!) {
// 		deleteAssetsByIds(ids: $ids) {
// 			assets {
// 				id
// 			}
// 			success
// 			message
// 		}
// 	}
// `
// mutator: KeyedMutator<GraphQLResponse<AssetsResponse>>

// const handleDelete = async (ids: string[]) => {
// 	console.log(ids)
// 	try {
// 		const res = await fetchWithToken<GraphQLResponse<AssetsResponse>>({
// 			query: DELETE_IMAGES,
// 			variables: { ids },
// 			getToken,
// 		})
// 		console.log(res)
// 		mutate()
// 	} catch (err) {
// 		console.error(err)
// 	} finally {
// 		setSelectedImages([])
// 	}
// }

const ImageLibrary = ({
	handleSelectedImage,
}: {
	handleSelectedImage: (_asset: Asset) => void
}) => {
	const { data, error } = useAllAssets()

	if (data) {
		return (
			<div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-4 gap-8">
				{data?.data?.assets?.map((img: Asset) => (
					<button
						type="button"
						style={{
							height: 300,
							// width: 300,
						}}
						onClick={() => handleSelectedImage(img)}
						className="relative bg-black rounded-lg cursor-pointer flex items-center justify-center overflow-hidden">
						<BlurImage
							alt={img.id}
							blurDataURL={img.blurhash}
							placeholder="blur"
							// we're multiplying the height and width by 100 to get the actual size as they are stored as a percentage
							height={img?.height ? img.height * 100 : 100}
							width={img?.width ? img.width * 100 : 100}
							src={img.variants[0] as string}
							loading="lazy"
							//  set fill to true if img.height is undefined
							fill={!img.height}
							// unoptimized
						/>
						{/* <input
							onChange={e => {
								// add the id of this img to the selectedImages array
								if (e.target.checked) {
									setSelectedImages(prev => [...prev, img.id])
								} else {
									// remove the id of this img from the selectedImages array
									setSelectedImages(prev =>
										prev.filter(id => id !== img.id)
									)
								}
							}}
							type="checkbox"
							className="appearance-none absolute top-4 right-4 h-8 w-8 rounded-full shadow-md bg-slate-200 border-2 border-slate-700 checked:bg-blue-700 checked:border-slate-100"
						/> */}
					</button>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-slate-600">Something is off</p>
				<p>{error.message}</p>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center h-full">
			<p className="text-slate-600">Loading...</p>
		</div>
	)
}

export default ImageLibrary
