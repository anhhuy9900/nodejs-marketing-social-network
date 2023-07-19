export interface QueryOptionArgs {
    resourceName?: string
}

export enum AdTypes {
    CUSTOMER_DETAIL = 'customerDetail',
    CAMPAIGN = 'campaign',
    AD_GROUP = 'adGroup',
    AD = 'ad',
    CUSTOMER_CLIENT = 'customerClient'
}

export interface AdFetchTypeArgs {
    refreshToken: string
    customerId?: string, 
    loginCustomerId?: string, 
    adType?: AdTypes, 
    resourceName?: string;
}