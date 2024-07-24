import { AssetResolver } from "./asset/asset.resolver"
import { DomainResolver } from "./domain/domain.resolver"
import { PageResolver } from "./page/page.resolver"
import { SiteResolver } from "./site/site.resolver"
import { TemplateResolver } from "./template/template.resolver"
import { UserResolver } from "../entities/user/user.resolver"
export const resolvers = [
    UserResolver,
    SiteResolver,
    TemplateResolver,
    AssetResolver,
    PageResolver,
    DomainResolver
] as const
