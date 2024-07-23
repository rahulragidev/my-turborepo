import { SiteModel } from "entities/site/site.type"
import { TemplateModel } from "entities/template/template.type"

export const getIndexes = async () => {
    // await SiteModel.collection.createIndex({ slug: 1 }, { unique: true })
    const response = await SiteModel.collection.getIndexes()
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
}

export const dropIndexes = async () => {
    const response = await SiteModel.collection.dropIndexes()
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
}

export const getTemplatesIndexes = async () => {
    const response = await TemplateModel.collection.getIndexes()
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
}
