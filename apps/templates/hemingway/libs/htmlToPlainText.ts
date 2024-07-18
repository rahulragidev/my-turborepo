import { JSDOM } from "jsdom"

const htmlToPlainText = (html: string) => {
	const dom = new JSDOM(html)
	return dom.window.document.body.textContent || ""
}

export default htmlToPlainText
