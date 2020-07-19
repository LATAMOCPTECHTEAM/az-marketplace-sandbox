export default interface ISettings {
    landingPageUrl: string;
    webhookUrl: string;
    publisherId: string;
    offerId: string;
    beneficiaryTenantId: string;
    purchaserTenantId: string;
    plans: {
        planId: string,
        displayName: string,
        isPrivate: boolean
    }[]
}