import { TemplateModel } from "entities/template/template.type"

export const resetIndexes = async () => {
    const response = await TemplateModel.collection.dropIndexes()
    console.log(`Dropped indexes for TemplateModel: ${response}`)
}

export const ensureIndexes = async () => {
    const response = await TemplateModel.collection.createIndexes([
        {
            key: {
                name: 1
            },
            name: "name"
        }
    ])
    console.log(`Created indexes for TemplateModel: ${response}`)
}
