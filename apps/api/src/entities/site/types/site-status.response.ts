// {
//   "accountId": "team_j4WxnYIgOMBNMiirjkM0FdsV",
//   "autoExposeSystemEnvs": true,
//   "buildCommand": null,
//   "createdAt": 1630252352626,
//   "devCommand": null,
//   "directoryListing": true,
//   "env": [
//     {
//       "type": "plain",
//       "value": "612bad40ea052100471dbf8e",
//       "target": [
//         "development",
//         "production",
//         "preview"
//       ],
//       "configurationId": "icfg_2sjvOeZ1vSFQQAmTNQWdwg2x",
//       "id": "6aQtFo2L7RcMn43t",
//       "key": "NEXT_PUBLIC_SITE_ID",
//       "createdAt": 1630252352892,
//       "updatedAt": 1630252352892,
//       "createdBy": "WRgm3eob8Bbuht6qMIm3JH6p",
//       "updatedBy": null
//     }
//   ],
//   "framework": "nextjs",
//   "gitForkProtection": true,
//   "id": "prj_0jwooznmMskwP5F5ZjJ75yuZEzUq",
//   "installCommand": null,
//   "name": "pradeep-muniganti",
//   "nodeVersion": "14.x",
//   "outputDirectory": null,
//   "publicSource": null,
//   "rootDirectory": null,
//   "serverlessFunctionRegion": "iad1",
//   "sourceFilesOutsideRootDirectory": true,
//   "updatedAt": 1632044516904,
//   "live": false,
//   "link": {
//     "type": "github",
//     "repo": "podium-template-zero",
//     "repoId": 380849051,
//     "org": "podium-dot-build",
//     "gitCredentialId": "cred_3e2dfe74671fed0f06bea7c2433edd6937c4f211",
//     "productionBranch": "main",
//     "createdAt": 1630252490869,
//     "updatedAt": 1630252490869,
//     "deployHooks": []
//   },
//   "latestDeployments": [
//     {
//       "alias": [
//         "pradeep-muniganti.vercel.app",
//         "pradeep-muniganti-0one.vercel.app",
//         "pradeep-muniganti-git-main-0one.vercel.app"
//       ],
//       "aliasAssigned": 1632044747162,
//       "builds": [],
//       "createdAt": 1632044516728,
//       "createdIn": "sfo1",
//       "deploymentHostname": "pradeep-muniganti-3u94gwm9s-0one",
//       "forced": false,
//       "id": "dpl_8Ne95zAmB38Dm1oaaoxb8jFrqwMB",
//       "name": "pradeep-muniganti",
//       "plan": "pro",
//       "private": true,
//       "readyState": "READY",
//       "target": "production",
//       "teamId": "team_j4WxnYIgOMBNMiirjkM0FdsV",
//       "type": "LAMBDAS",
//       "url": "pradeep-muniganti-3u94gwm9s-0one.vercel.app",
//       "userId": "WRgm3eob8Bbuht6qMIm3JH6p",
//       "withCache": false
//     },
//     {
//       "alias": [
//         "pradeep-muniganti.vercel.app",
//         "pradeep-muniganti-0one.vercel.app",
//         "pradeep-muniganti-git-main-0one.vercel.app"
//       ],
//       "aliasAssigned": 1631462271292,
//       "builds": [],
//       "createdAt": 1631462197654,
//       "createdIn": "sfo1",
//       "creator": {
//         "uid": "WRgm3eob8Bbuht6qMIm3JH6p",
//         "email": "praneeth@clearcut.design",
//         "username": "praneethpike",
//         "githubLogin": "Praneeth-Pike"
//       },
//       "deploymentHostname": "pradeep-muniganti-q4pyjxjp1-0one",
//       "forced": true,
//       "id": "dpl_AP2tLdMqsqD5gHTFfHkdmxUUsX6C",
//       "name": "pradeep-muniganti",
//       "plan": "pro",
//       "private": true,
//       "readyState": "READY",
//       "target": "production",
//       "teamId": "team_j4WxnYIgOMBNMiirjkM0FdsV",
//       "type": "LAMBDAS",
//       "url": "pradeep-muniganti-q4pyjxjp1-0one.vercel.app",
//       "userId": "WRgm3eob8Bbuht6qMIm3JH6p",
//       "withCache": false
//     }
//   ],
//   "targets": {
//     "production": {
//       "alias": [
//         "pradeep-muniganti.vercel.app",
//         "pradeep-muniganti-0one.vercel.app",
//         "pradeep-muniganti-git-main-0one.vercel.app"
//       ],
//       "aliasAssigned": 1632044747162,
//       "builds": [],
//       "createdAt": 1632044516728,
//       "createdIn": "sfo1",
//       "creator": {
//         "uid": "WRgm3eob8Bbuht6qMIm3JH6p",
//         "email": "praneeth@clearcut.design",
//         "username": "praneethpike",
//         "githubLogin": "Praneeth-Pike"
//       },
//       "deploymentHostname": "pradeep-muniganti-3u94gwm9s-0one",
//       "forced": false,
//       "id": "dpl_8Ne95zAmB38Dm1oaaoxb8jFrqwMB",
//       "name": "pradeep-muniganti",
//       "plan": "pro",
//       "private": true,
//       "readyState": "READY",
//       "target": "production",
//       "teamId": "team_j4WxnYIgOMBNMiirjkM0FdsV",
//       "type": "LAMBDAS",
//       "url": "pradeep-muniganti-3u94gwm9s-0one.vercel.app",
//       "userId": "WRgm3eob8Bbuht6qMIm3JH6p",
//       "withCache": false
//     }
//   }
// }

import { Field, ObjectType, registerEnumType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

export enum ReadyStatusEnum {
    QUEUED = "QUEUED",
    BUILDING = "BUILDING",
    ERROR = "ERROR",
    INITIALIZING = "INITIALIZING",
    READY = "READY",
    CANCELED = "CANCELED",
    FROZEN = "FROZEN"
}

registerEnumType(ReadyStatusEnum, { name: "ReadyStatusEnum" })

@ObjectType({ description: "Site Status" })
export class SiteStatus {
    @Field({ nullable: true })
    readyState?: string

    @Field({ nullable: true })
    createdAt?: number

    @Field({ nullable: true })
    domain?: string
}

@ObjectType({ description: "Site status" })
export class SiteStatusResponse extends ResponseSchema {
    @Field(_type => SiteStatus, { nullable: true })
    data?: SiteStatus
}
