import { TemplateModel } from "entities/template/template.type"

const deleteTestTemplates = async () => {
    try {
        await TemplateModel.deleteMany({ name: { $ne: "template-zero" } })
        console.log("Templates deleted successfully")
    } catch (error) {
        console.error("An error occurred while deleting templates:", error)
    }
}

export default deleteTestTemplates
