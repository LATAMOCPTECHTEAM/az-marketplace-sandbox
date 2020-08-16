export default interface ISettings {
    beneficiaryTenantId: string;
    landingPageUrl: string;
    offerId: string;
    plans: ISettingsPlan[],
    publisherId: string;
    purchaserTenantId: string;
    webhookUrl: string;
}

export interface ISettingsPlan {
    displayName: string,
    isPrivate: boolean,
    planId: string
}