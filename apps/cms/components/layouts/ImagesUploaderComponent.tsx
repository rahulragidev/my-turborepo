import { useAuth } from "@clerk/nextjs"
import Button from "components/Button"
import DynamicImage from "components/DynamicImage"
import FileDropComponent from "components/organisms/FileDropComponent"
import useAllAssets from "dataHooks/useAllAssets"
import UploadFile from "libs/uploadFile"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { Delete } from "react-iconly"
import { MoonLoader } from "react-spinners"

const ImagesUploaderComponent = () => {
	const uploadInputRef = useRef<HTMLInputElement>(null)
	const [droppedFiles, setDroppedFiles] = useState<File[]>([])
	const [isUploading, setIsUploading] = useState(false)

	const { mutate } = useAllAssets()
	const { getToken } = useAuth()

	useEffect(() => {
		if (droppedFiles) {
			console.log("droppedFiles", droppedFiles)
		}
	}, [droppedFiles])

	const handleUpload = async () => {
		try {
			if (!droppedFiles) {
				return
			}
			setIsUploading(true)
			const files = droppedFiles
			const token = await getToken()
			const promises = files.map(async file => {
				const result = await UploadFile(file, token as string)
				return result
			})
			const results = await Promise.all(promises)
			console.log("results", results)
			toast.success("Uploaded successfully")
			setDroppedFiles([])
			mutate()
		} catch (error: any) {
			console.error(error)
			toast.error(error.message || "Something went wrong")
			setDroppedFiles([])
		} finally {
			setIsUploading(false)
			setDroppedFiles([])
		}
	}

	return (
		<FileDropComponent
			noStyling
			className="relative"
			onDrop={files => setDroppedFiles(files)}>
			<div className="w-full rounded-md py-4">
				{droppedFiles && droppedFiles.length > 0 ? (
					<>
						<p className="my-4 ml-12 text-sm uppercase text-slate-400 tracking-widest">
							Ready to Upload
						</p>
						<div className="w-full flex flex-nowrap items-center overflow-x-scroll space-x-4 px-12 py-6">
							{droppedFiles.map(file => (
								<div
									style={{
										height: 300,
									}}
									className="relative bg-black rounded-lg cursor-pointer flex min-w-[300px] max-w-[300px] items-center justify-center overflow-hidden">
									<DynamicImage file={file} />
									{isUploading ? (
										<div className="flex flex-col items-center justify-center absolute h-full w-full top-0 left-0 bg-[hsla(250,25%,10%,0.8)] backdrop-filter-blur pointer-events-none">
											<MoonLoader color="white" />
											<p>Uploading..</p>
										</div>
									) : (
										<Button
											variant="tertiary"
											rounded
											className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.3)]"
											onClick={() => {
												setDroppedFiles(prev => {
													const newFiles = prev.filter(
														f => f.name !== file.name
													)
													return newFiles
												})
											}}>
											<Delete />
										</Button>
									)}
								</div>
							))}
						</div>
						{!isUploading && (
							<div className="flex justify-end items-center px-8 py-2">
								<Button
									variant="tertiary"
									onClick={() => setDroppedFiles([])}>
									Clear All
								</Button>
								<Button onClick={() => handleUpload()}>Upload All</Button>
							</div>
						)}
					</>
				) : (
					<div className="space-y-2 py-6 px-12">
						<p>Drag your files here or </p>
						<Button
							variant="secondary"
							onClick={() => uploadInputRef.current?.click()}>
							Browse Files to Upload
						</Button>
						<p>
							<em className="text-slate-500">
								Accepts .jpg, .jpeg, .png, .gif, .svg
							</em>
						</p>
					</div>
				)}
			</div>
			<input
				onChange={e => {
					setDroppedFiles(prev => {
						const newFiles = prev ? [...prev] : []
						return e.target.files
							? [...newFiles, ...Array.from(e.target.files)]
							: newFiles
					})
				}}
				enterKeyHint="done"
				type="file"
				ref={uploadInputRef}
				multiple
				accept=".jpg, .jpeg, .png, .svg, .gif"
				className="hidden"
				hidden
			/>
		</FileDropComponent>
	)
}

export default ImagesUploaderComponent
