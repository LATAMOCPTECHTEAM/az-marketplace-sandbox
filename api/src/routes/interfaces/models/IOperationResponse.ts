
/**
 * @swagger
 * components:
 *   schemas:
 *     OperationResponse:
 *      type: "object"
 *      properties:
 *        id:
 *          type: "string"
 *          description: " Operation ID, should be provided in the patch operation API call"
 *          example: "<guid>"
 *        activityId:
 *          type: "string"
 *          example: "<guid>"
 *        subscriptionId:
 *          type: "string"
 *          example: "<guid>"
 *          description: "subscriptionId of the SaaS subscription for which this operation is relevant"
 *        publisherId:
 *          type: "string"
 *          example: "publisherId"
 *        offerId:
 *          type: "string"
 *          example: "offerId"
 *        planId:
 *          type: "string"
 *          example: "planId"
 *        quantity:
 *          type: "string"
 *          example: "20"
 *        action:
 *          type: "string"
 *          example: "changePlan"
 *        timeStamp:
 *          type: "string"
 *          example: "2018-12-01T00:00:00"
 *        status:
 *          type: "string"
 *          example: "InProgress"
*/
export default interface IOperationResponse {
    id: string;
    activityId: string;
    subscriptionId: string;
    offerId: string;
    publisherId: string;
    planId: string;
    quantity: string;
    action: string;
    timeStamp: string;
    status: string;
}