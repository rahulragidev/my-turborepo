import * as AssetController from "./asset.controller"
import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver
} from "type-graphql"
import { Asset } from "./asset.type"
import { AssetResponse } from "./types/asset.response"
import { AssetsResponse } from "./types/assets.response"
import { AuthRequestContext } from "auth/request-context"

@Resolver(_of => Asset)
export class AssetResolver {
    @Authorized()
    @Query(_returns => AssetsResponse)
    async allMyAssets(
        @Ctx() context: AuthRequestContext,
        @Arg("userId", { nullable: true }) userId?: string
    ): Promise<AssetsResponse> {
        return await AssetController.allMyAssets(context, userId)
    }

    @Authorized()
    @Query(_returns => Int)
    async myLibraryUsage(
        @Ctx() context: AuthRequestContext,
        @Arg("userId", { nullable: true }) userId?: string
    ): Promise<number> {
        return await AssetController.libraryUsage(context, userId)
    }

    @Mutation(_returns => AssetResponse)
    async deleteAsset(
        @Arg("id") id: string,
        @Ctx() context: AuthRequestContext
    ): Promise<AssetResponse> {
        return await AssetController.deleteAsset(id, context)
    }

    @Mutation(_returns => AssetsResponse)
    async deleteAllUserAssets(
        @Ctx() context: AuthRequestContext
    ): Promise<AssetsResponse> {
        return await AssetController.deleteAllUserAssets(context)
    }

    @Authorized()
    @Mutation(_returns => AssetsResponse)
    async deleteAssetsByIds(
        @Arg("ids", __type => [String!]) ids: string[],
        @Ctx() context: AuthRequestContext
    ): Promise<AssetsResponse> {
        return await AssetController.deleteAssets(ids, context)
    }
}
