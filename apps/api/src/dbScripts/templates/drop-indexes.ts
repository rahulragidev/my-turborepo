import { TemplateModel } from "entities/template/template.type"

const dropIndexes = async () => {
    try {
        const response = await TemplateModel.collection
            .dropIndexes()
            .then(value => {
                console.log(`dropIndexes: ${value}`)
                return value
            })
        return response
    } catch (error) {
        console.log(`error: ${error}`)
        return null
    }
}

export default dropIndexes
