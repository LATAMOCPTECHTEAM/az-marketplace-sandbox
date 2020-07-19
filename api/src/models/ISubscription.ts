export default interface ISubscription {
    id: string;
    name: string;
    publisherId: string;
    offerId: string;
    planId: string;
    quantity: string;
    beneficiary: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    purchaser: {
        emailId: string,
        objectId: string,
        tenantId: string
    },
    term: {
        startDate: string,
        endDate: string,
        termUnit: string,
    },
    allowedCustomerOperations: string[],
    sessionMode: string,
    isFreeTrial: boolean,
    isTest: boolean,
    sandboxType: string,
    saasSubscriptionStatus: string,
    creationDate: Date
}