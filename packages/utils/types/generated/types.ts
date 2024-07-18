export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
};

/** Asset */
export type Asset = {
  __typename?: 'Asset';
  blurhash: Scalars['String']['output'];
  cloudfareId?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  /** This is the key from the bucket */
  key: Scalars['String']['output'];
  lastReferenceCheckedAt?: Maybe<Scalars['String']['output']>;
  mimeType: Scalars['String']['output'];
  originalFileName: Scalars['String']['output'];
  owner: User;
  size: Scalars['Float']['output'];
  variants: Array<Scalars['String']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type AssetResponse = {
  __typename?: 'AssetResponse';
  asset?: Maybe<Asset>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AssetsResponse = {
  __typename?: 'AssetsResponse';
  assets?: Maybe<Array<Asset>>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export enum AuthRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  User = 'USER'
}

/** Change Site Template Response */
export type ChangeSiteTemplateResponse = {
  __typename?: 'ChangeSiteTemplateResponse';
  data?: Maybe<Site>;
  message?: Maybe<Scalars['String']['output']>;
  siteStatus?: Maybe<SiteStatusResponse>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Create Sites Response */
export type CreateSiteResponse = {
  __typename?: 'CreateSiteResponse';
  data?: Maybe<Site>;
  envsAdded: Scalars['Boolean']['output'];
  frameWorkSet: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  pageCreated: Scalars['Boolean']['output'];
  siteCreated: Scalars['Boolean']['output'];
  siteUpdatedWithVercelProjectId: Scalars['Boolean']['output'];
  subdomainAdded: Scalars['Boolean']['output'];
  vercelProjectCreated: Scalars['Boolean']['output'];
};

/** Create Sites Response */
export type DeploySiteResponse = {
  __typename?: 'DeploySiteResponse';
  message?: Maybe<Scalars['String']['output']>;
  siteId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<SiteStatus>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Domain = {
  __typename?: 'Domain';
  boughtAt?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Float']['output'];
  creator: DomainCreator;
  customNameservers?: Maybe<Array<Scalars['String']['output']>>;
  expiresAt?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  intendedNameservers: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nameservers: Array<Scalars['String']['output']>;
  orderedAt?: Maybe<Scalars['Float']['output']>;
  renew: Scalars['Boolean']['output'];
  serviceType: Scalars['String']['output'];
  suffix: Scalars['Boolean']['output'];
  transferStartedAt?: Maybe<Scalars['Float']['output']>;
  transferredAt?: Maybe<Scalars['Float']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type DomainConfigurationInterface = {
  __typename?: 'DomainConfigurationInterface';
  acceptedChallenges?: Maybe<Array<Scalars['String']['output']>>;
  configuredBy?: Maybe<Scalars['String']['output']>;
  misconfigured: Scalars['Boolean']['output'];
};

/** Domain Configuration Response */
export type DomainConfigurationResponse = {
  __typename?: 'DomainConfigurationResponse';
  data?: Maybe<DomainConfigurationInterface>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DomainCreator = {
  __typename?: 'DomainCreator';
  customerId?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isDomainReseller?: Maybe<Scalars['Boolean']['output']>;
  username: Scalars['String']['output'];
};

export type DomainInformationResponse = {
  __typename?: 'DomainInformationResponse';
  data: DomainResponse;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DomainPriceResponse = {
  __typename?: 'DomainPriceResponse';
  data: Response;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Domain Information */
export type DomainRegisterResponse = {
  __typename?: 'DomainRegisterResponse';
  data: ResponseInterface;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Domain Information */
export type DomainResponse = {
  __typename?: 'DomainResponse';
  domain: Domain;
};

export type DomainVerification = {
  __typename?: 'DomainVerification';
  domain: Scalars['String']['output'];
  reason: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export enum FrameworkEnum {
  Gatsbyjs = 'GATSBYJS',
  Nextjs = 'NEXTJS'
}

export enum GitProvider {
  Bitbucket = 'Bitbucket',
  Github = 'Github'
}

/** Git Repository / Source */
export type GitRepository = {
  __typename?: 'GitRepository';
  ref: Scalars['String']['output'];
  repoId: Scalars['Float']['output'];
  target: Scalars['String']['output'];
  type: GitProvider;
  url?: Maybe<Scalars['String']['output']>;
};

/** Git Repository Input */
export type GitRepositoryInput = {
  ref?: InputMaybe<Scalars['String']['input']>;
  repoId: Scalars['String']['input'];
  target?: InputMaybe<Scalars['String']['input']>;
  type?: GitProvider;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCustomDomain: SiteResponse;
  assignParent: PageResponse;
  changeSiteTemplate: ChangeSiteTemplateResponse;
  createPage: PageResponse;
  createSite: CreateSiteResponse;
  createTemplate: TemplateResponse;
  createUser: UserResponse;
  deleteAllUserAssets: AssetsResponse;
  deleteAsset: AssetResponse;
  deleteAssetsByIds: AssetsResponse;
  deleteCustomDomain: SiteResponse;
  deletePage: PageResponse;
  deleteSite: ResponseSchema;
  deleteTemplate: ResponseSchema;
  deploySite: DeploySiteResponse;
  publishPage: PageResponse;
  /** Warning! Don't use this. */
  removeParent_deprecated: PageResponse;
  removeSiteLogo: SiteResponse;
  updatePage: PageResponse;
  updatePrimaryDomain: SiteResponse;
  updateSite: SiteResponse;
  updateSiteLogo: SiteResponse;
  updateSitePagesPriority: ResponseSchema;
  /** Admin only, needs API key */
  updateTemplate: TemplateResponse;
  updateTemplateBannerImage: TemplateResponse;
  updateUser: UserResponse;
};


export type MutationAddCustomDomainArgs = {
  domainName: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
};


export type MutationAssignParentArgs = {
  pageId: Scalars['String']['input'];
  parentId: Scalars['String']['input'];
};


export type MutationChangeSiteTemplateArgs = {
  siteId: Scalars['String']['input'];
  templateId: Scalars['String']['input'];
};


export type MutationCreatePageArgs = {
  name: Scalars['String']['input'];
  parent?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
};


export type MutationCreateSiteArgs = {
  data: SiteInput;
};


export type MutationCreateTemplateArgs = {
  inputData: TemplateInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteAssetsByIdsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationDeleteCustomDomainArgs = {
  domainName: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
};


export type MutationDeletePageArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSiteArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTemplateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeploySiteArgs = {
  siteId: Scalars['String']['input'];
};


export type MutationPublishPageArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveParent_DeprecatedArgs = {
  pageId: Scalars['String']['input'];
};


export type MutationRemoveSiteLogoArgs = {
  logoType?: Scalars['String']['input'];
  siteId: Scalars['String']['input'];
};


export type MutationUpdatePageArgs = {
  data: UpdatePageInput;
  id: Scalars['String']['input'];
};


export type MutationUpdatePrimaryDomainArgs = {
  domainName: Scalars['String']['input'];
  siteId: Scalars['ID']['input'];
};


export type MutationUpdateSiteArgs = {
  data: UpdateSiteInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateSiteLogoArgs = {
  desktopLogo?: InputMaybe<Scalars['String']['input']>;
  mobileLogo?: InputMaybe<Scalars['String']['input']>;
  siteId: Scalars['String']['input'];
};


export type MutationUpdateSitePagesPriorityArgs = {
  data: UpdatePagesPriorityInput;
};


export type MutationUpdateTemplateArgs = {
  data: TemplateUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateTemplateBannerImageArgs = {
  bannerImage: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NewDomain = {
  __typename?: 'NewDomain';
  boughtAt?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['Float']['output'];
  creator: DomainCreator;
  customNameservers?: Maybe<Array<Scalars['String']['output']>>;
  expiresAt?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  intendedNameservers: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nameservers: Array<Scalars['String']['output']>;
  orderedAt?: Maybe<Scalars['Float']['output']>;
  renew: Scalars['Boolean']['output'];
  serviceType: Scalars['String']['output'];
  transferStartedAt?: Maybe<Scalars['Float']['output']>;
  transferredAt?: Maybe<Scalars['Float']['output']>;
  verified: Scalars['Boolean']['output'];
};

/** Page */
export type Page = {
  __typename?: 'Page';
  bannerImage?: Maybe<Asset>;
  body: Scalars['String']['output'];
  children: Array<Page>;
  createdAt: Scalars['DateTimeISO']['output'];
  draftBody?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFeatured: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  jsonBody?: Maybe<Scalars['JSON']['output']>;
  jsonDraftBody?: Maybe<Scalars['JSON']['output']>;
  lastPublishedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner: Scalars['ID']['output'];
  parent?: Maybe<Page>;
  priority: Scalars['Int']['output'];
  site: Scalars['ID']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export enum PageFilterEnum {
  Any = 'ANY',
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type PageResponse = {
  __typename?: 'PageResponse';
  data?: Maybe<Page>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type PagesResponse = {
  __typename?: 'PagesResponse';
  data?: Maybe<Array<Page>>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Pagination = {
  __typename?: 'Pagination';
  count: Scalars['Float']['output'];
  next?: Maybe<Scalars['Float']['output']>;
  prev?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  allMyAssets: AssetsResponse;
  checkDomainStatus: ResponseSchema;
  checkSiteNameAvailability: ResponseSchema;
  checkSubscription?: Maybe<Scalars['String']['output']>;
  checkUser?: Maybe<Scalars['String']['output']>;
  getAllMySite: SitesResponse;
  getAllOrphanPagesBySite: PagesResponse;
  getAllPagesBySite: PagesResponse;
  getAllSiteDomainsLinked: SiteDomainsResponse;
  getDomainConfiguration: DomainConfigurationResponse;
  getDomainInformation: DomainInformationResponse;
  getDomainPrice: DomainPriceResponse;
  getFeaturedPagesBySite: PagesResponse;
  getMySiteById: SiteResponse;
  getPage: PageResponse;
  getPageBySlug: PageResponse;
  getRootPage: PageResponse;
  getSiteById: SiteResponse;
  getSiteStatus: SiteStatusResponse;
  getTemplateById: TemplateResponse;
  getTemplates: TemplatesResponse;
  me: UserResponse;
  myLibraryUsage: Scalars['Int']['output'];
  purchaseDomain: ResponseSchema;
  registerOrTransferInDomain: DomainRegisterResponse;
  verfiyProjectDomain: VercelProjectDomain;
};


export type QueryAllMyAssetsArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCheckDomainStatusArgs = {
  name: Scalars['String']['input'];
};


export type QueryCheckSiteNameAvailabilityArgs = {
  nameOrSlug: Scalars['String']['input'];
};


export type QueryCheckSubscriptionArgs = {
  email: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
};


export type QueryCheckUserArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetAllOrphanPagesBySiteArgs = {
  filter?: InputMaybe<PageFilterEnum>;
  siteId: Scalars['String']['input'];
};


export type QueryGetAllPagesBySiteArgs = {
  filter?: InputMaybe<PageFilterEnum>;
  siteId: Scalars['String']['input'];
};


export type QueryGetAllSiteDomainsLinkedArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetDomainConfigurationArgs = {
  domain: Scalars['String']['input'];
};


export type QueryGetDomainInformationArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetDomainPriceArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetFeaturedPagesBySiteArgs = {
  filter?: InputMaybe<PageFilterEnum>;
  siteId: Scalars['String']['input'];
};


export type QueryGetMySiteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPageArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPageBySlugArgs = {
  filter?: InputMaybe<PageFilterEnum>;
  siteId: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type QueryGetRootPageArgs = {
  siteId: Scalars['String']['input'];
};


export type QueryGetSiteByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetSiteStatusArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetTemplateByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMyLibraryUsageArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPurchaseDomainArgs = {
  expectedPrice?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  renew?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryRegisterOrTransferInDomainArgs = {
  name: Scalars['String']['input'];
};


export type QueryVerfiyProjectDomainArgs = {
  domainName: Scalars['String']['input'];
  projectName: Scalars['String']['input'];
};

export type Recurring = {
  __typename?: 'Recurring';
  interval?: Maybe<Scalars['String']['output']>;
  interval_count?: Maybe<Scalars['Float']['output']>;
  usage_type?: Maybe<Scalars['String']['output']>;
};

export type Response = {
  __typename?: 'Response';
  /** The number of years the domain could be held before paying again */
  period?: Maybe<Scalars['Float']['output']>;
  /** The domain price in USD */
  price?: Maybe<Scalars['Float']['output']>;
};

export type ResponseInterface = {
  __typename?: 'ResponseInterface';
  domain?: Maybe<NewDomain>;
};

export type ResponseSchema = {
  __typename?: 'ResponseSchema';
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Site = {
  __typename?: 'Site';
  createdAt: Scalars['DateTimeISO']['output'];
  customDomain?: Maybe<Array<VercelProjectDomain>>;
  desktopLogo?: Maybe<Asset>;
  /** @deprecated use rootPage instead */
  headerPages?: Maybe<Array<Page>>;
  id: Scalars['ID']['output'];
  logoPreference?: Maybe<Scalars['String']['output']>;
  mobileLogo?: Maybe<Asset>;
  name?: Maybe<Scalars['String']['output']>;
  owner: User;
  pages?: Maybe<Array<Page>>;
  primaryDomain?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  rootPage: Page;
  setup: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  template: Scalars['ID']['output'];
  textLogo?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  url?: Maybe<Scalars['String']['output']>;
  vercelProjectId?: Maybe<Scalars['String']['output']>;
};

export type SiteDomainsResponse = {
  __typename?: 'SiteDomainsResponse';
  data?: Maybe<VercelProjectDomainsResponse>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SiteInput = {
  slug: Scalars['String']['input'];
  templateId?: Scalars['String']['input'];
};

/** Site Response */
export type SiteResponse = {
  __typename?: 'SiteResponse';
  data?: Maybe<Site>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Site Status */
export type SiteStatus = {
  __typename?: 'SiteStatus';
  createdAt?: Maybe<Scalars['Float']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  readyState?: Maybe<Scalars['String']['output']>;
};

/** Site status */
export type SiteStatusResponse = {
  __typename?: 'SiteStatusResponse';
  data?: Maybe<SiteStatus>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Sites Response */
export type SitesResponse = {
  __typename?: 'SitesResponse';
  data?: Maybe<Array<Site>>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type StripePrice = {
  __typename?: 'StripePrice';
  active: Scalars['Boolean']['output'];
  /** Describes how to compute the price per period. Either per_unit or tiered. per_unit indicates that the fixed amount (specified in unit_amount or unit_amount_decimal) will be charged per unit in quantity (for prices with usage_type=licensed), or per unit of total usage (for prices with usage_type=metered). tiered indicates that the unit pricing will be computed using a tiering strategy as defined using the tiers and tiers_mode attributes. */
  billing_scheme: Scalars['String']['output'];
  created: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  custom_unit_amount?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  /** is true if the object exists in live, false if it's in test mode */
  livemode: Scalars['Boolean']['output'];
  lookup_key?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  nickname?: Maybe<Scalars['String']['output']>;
  object: Scalars['String']['output'];
  /** The Product Id that this Price is linked to */
  product: Scalars['String']['output'];
  recurring?: Maybe<Recurring>;
  tax_behavior?: Maybe<Scalars['String']['output']>;
  tiers_mode?: Maybe<Scalars['String']['output']>;
  transform_quantity?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  /** The actual price number */
  unit_amount?: Maybe<Scalars['Int']['output']>;
  unit_amount_decimal?: Maybe<Scalars['String']['output']>;
};

export type StripeProduct = {
  __typename?: 'StripeProduct';
  active: Scalars['Boolean']['output'];
  default_price?: Maybe<StripePrice>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether the product is in live mode / test mode */
  livemode: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  package_dimensions?: Maybe<Scalars['String']['output']>;
  prices?: Maybe<Array<StripePrice>>;
  shippable?: Maybe<Scalars['Boolean']['output']>;
  statement_descriptor?: Maybe<Scalars['String']['output']>;
  tax_code?: Maybe<Scalars['String']['output']>;
  unit_label?: Maybe<Scalars['String']['output']>;
  updated: Scalars['Float']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  application?: Maybe<Scalars['JSONObject']['output']>;
  application_fee_percent?: Maybe<Scalars['String']['output']>;
  automatic_tax?: Maybe<Scalars['String']['output']>;
  billing_cycle_anchor?: Maybe<Scalars['String']['output']>;
  billing_thresholds?: Maybe<Scalars['JSONObject']['output']>;
  cancel_at?: Maybe<Scalars['String']['output']>;
  cancel_at_period_end?: Maybe<Scalars['String']['output']>;
  canceled_at?: Maybe<Scalars['String']['output']>;
  cancellation_details?: Maybe<Scalars['JSONObject']['output']>;
  collection_method?: Maybe<Scalars['JSONObject']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  currentPlan?: Maybe<StripePrice>;
  current_period_end?: Maybe<Scalars['String']['output']>;
  current_period_start?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<Scalars['String']['output']>;
  days_until_due?: Maybe<Scalars['Int']['output']>;
  default_payment_method?: Maybe<Scalars['JSONObject']['output']>;
  default_source?: Maybe<Scalars['JSONObject']['output']>;
  default_tax_rates?: Maybe<Array<Scalars['JSONObject']['output']>>;
  description?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['JSONObject']['output']>;
  ended_at?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  livemode?: Maybe<Scalars['Boolean']['output']>;
  metadata?: Maybe<Scalars['JSONObject']['output']>;
  next_pending_invoice_item_invoice?: Maybe<Scalars['String']['output']>;
  object?: Maybe<Scalars['String']['output']>;
  on_behalf_of?: Maybe<Scalars['JSONObject']['output']>;
  pause_collection?: Maybe<Scalars['JSONObject']['output']>;
  payment_settings?: Maybe<Scalars['String']['output']>;
  pending_invoice_item_interval?: Maybe<Scalars['String']['output']>;
  pending_setup_intent?: Maybe<Scalars['String']['output']>;
  pending_update?: Maybe<Scalars['String']['output']>;
  schedule?: Maybe<Scalars['String']['output']>;
  start_date?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  test_clock?: Maybe<Scalars['String']['output']>;
  transfer_data?: Maybe<Scalars['String']['output']>;
  trial_end?: Maybe<Scalars['String']['output']>;
  trial_start?: Maybe<Scalars['String']['output']>;
};

/** Template */
export type Template = {
  __typename?: 'Template';
  bannerImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  creator?: Maybe<Scalars['ID']['output']>;
  demoLink?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  framework: FrameworkEnum;
  gitSource: GitRepository;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** The Product from Stripe */
  stripeProduct?: Maybe<StripeProduct>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

/** Template Input */
export type TemplateInput = {
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  creator?: InputMaybe<Scalars['String']['input']>;
  demoLink?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  framework?: InputMaybe<Scalars['String']['input']>;
  gitSource: GitRepositoryInput;
  name: Scalars['String']['input'];
  stripeProduct?: InputMaybe<Scalars['String']['input']>;
};

/** Template Response */
export type TemplateResponse = {
  __typename?: 'TemplateResponse';
  data?: Maybe<Template>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Template Update Input */
export type TemplateUpdateInput = {
  bannerImage?: InputMaybe<Scalars['String']['input']>;
  demoLink?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  framework?: InputMaybe<Scalars['String']['input']>;
  gitSource?: InputMaybe<GitRepositoryInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  stripeProduct?: InputMaybe<Scalars['String']['input']>;
};

/** Template Response */
export type TemplatesResponse = {
  __typename?: 'TemplatesResponse';
  data?: Maybe<Array<Template>>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdatePageInput = {
  bannerImage?: InputMaybe<Scalars['ID']['input']>;
  draftBody?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  jsonDraftBody?: InputMaybe<Scalars['JSON']['input']>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePagesPriority = {
  id: Scalars['ID']['input'];
  priority: Scalars['Float']['input'];
};

export type UpdatePagesPriorityInput = {
  pagesList: Array<UpdatePagesPriority>;
};

export type UpdateSiteInput = {
  desktopLogo?: InputMaybe<Scalars['ID']['input']>;
  mobileLogo?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  textLogo?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  onboardingState?: InputMaybe<Scalars['Int']['input']>;
};

/** User model */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  onboardingState: Scalars['Int']['output'];
  role: AuthRole;
  sites?: Maybe<Array<Site>>;
  subscription?: Maybe<StripeSubscription>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type UserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  onboardingState?: Scalars['Int']['input'];
  trialExpires: Scalars['String']['input'];
};

/** User Response */
export type UserResponse = {
  __typename?: 'UserResponse';
  data?: Maybe<User>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Domain Response from vercel */
export type VercelProjectDomain = {
  __typename?: 'VercelProjectDomain';
  apexName: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Float']['output']>;
  gitBranch?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  redirect?: Maybe<Scalars['String']['output']>;
  redirectStatusCode?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['Float']['output']>;
  verification?: Maybe<Array<DomainVerification>>;
  verified: Scalars['Boolean']['output'];
};

export type VercelProjectDomainsResponse = {
  __typename?: 'VercelProjectDomainsResponse';
  domains?: Maybe<Array<VercelProjectDomain>>;
  pagination: Pagination;
};
