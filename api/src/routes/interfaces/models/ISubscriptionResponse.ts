/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionResponse:
 *      type: "object"
 *      properties:
 *        id:
 *          type: "string"
 *          example: "b945e003-e595-44aa-a3ab-eb7cd6856715"
 *        name:
 *          type: "string"
 *          example: "Contoso Cloud Solution"
 *        publisherId:
 *          type: "string"
 *          example: "offerId"
 *        offerId:
 *          type: "string"
 *          example: "offerId"
 *        planId:
 *          type: "string"
 *          example: "planId"
 *        quantity:
 *          type: "string"
 *          example: "20"
 *        beneficiary:
 *          type: "object" 
 *          properties:
 *            emailId:
 *              type: "string"
 *              example: "contoso@contoso.com"
 *            objectId:
 *              type: "string"
 *              example: "bcba448fa6a84bf59cae2f18764bce31"
 *            tenantId:
 *              type: "string"
 *              example: "3211f402554f4f3aa29b893770153647"
 *        purchaser:
 *          type: "object" 
 *          properties:
 *            emailId:
 *              type: "string"
 *              example: "contoso@contoso.com"
 *            objectId:
 *              type: "string"
 *              example: "bcba448fa6a84bf59cae2f18764bce31"
 *            tenantId:
 *              type: "string"
 *              example: "3211f402554f4f3aa29b893770153647"
 *        term:
 *          type: "object" 
 *          properties:
 *            startDate:
 *              type: "string"
 *              example: "2019-05-31"
 *            endDate:
 *              type: "string"
 *              example: "2019-06-29"
 *            termUnit:
 *              type: "string"
 *              example: "P1M"
 *        allowedCustomerOperations:
 *          type: "array"
 *          items:
 *            type: "string"
 *            enum: [Read, Update, Delete]
*/
export default interface ISubscriptionResponse {
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
    saasSubscriptionStatus: string
}