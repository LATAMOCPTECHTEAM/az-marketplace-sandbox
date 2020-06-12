
/**
 * @swagger
 * components:
 *   schemas:
 *     ResolveResponse:
 *      type: "object"
 *      properties:
 *        id:
 *          type: "string"
 *          example: "b945e003-e595-44aa-a3ab-eb7cd6856715"
 *        subscriptionName:
 *          type: "string"
 *          example: "Contoso Cloud Solution"
 *        offerId:
 *          type: "string"
 *          example: "offerId"
 *        planId:
 *          type: "string"
 *          example: "planId"
 *        quantity:
 *          type: "string"
 *          example: "20"
*/
export default interface IResolveResponse {
    id: string;
    subscriptionName: string;
    offerId: string;
    planId: string;
    quantity: string;
}