import { User } from "entities/user/user.type"
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Upload {
    @prop({ required: true })
    url!: string

    @prop({ ref: "User" })
    owner!: Ref<User>
}

export const UploadModel = getModelForClass(Upload)
