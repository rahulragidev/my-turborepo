import { Lightbulb } from "lucide-react"
import NameCheck from "./components/name-check"
import checkTemplateId from "./functions/check-template-id"

interface Props {
	searchParams: {
		templateId?: string
	}
}

const Page = async ({ searchParams: { templateId } }: Props) => {
	const isValidTemplateId = await checkTemplateId(templateId)

	return (
		<div className="flex flex-col gap-4 py-24 px-8 lg:px-0">
			<div className="my-12 pl-4 mx-auto w-full max-w-5xl text-center flex flex-col justify-center">
				<h1 className="text-6xl text-slate-300 capitalize tracking-tight">
					Your Lokus Website Address
				</h1>
				<p className="text-lg text-slate-400 mb-4 tracking-tight">
					This will be the URL of your website (For ex:
					https://your-site-name.lokus.io)
				</p>
				<div className="flex mx-auto items-center pl-1 pr-3 py-1 rounded bg-slate-900 max-w-fit mb-12">
					<Lightbulb height={12} />
					<p>You can add your custom domain after launching the site</p>
				</div>
				<NameCheck templateId={isValidTemplateId ? templateId : undefined} />
			</div>
		</div>
	)
}

export default Page
