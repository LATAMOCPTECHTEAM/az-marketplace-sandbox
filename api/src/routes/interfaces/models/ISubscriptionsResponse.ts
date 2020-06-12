import ISubscriptionResponse from "./ISubscriptionResponse";

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionsResponse:
 *      type: "object"
 *      properties:
 *        subscriptions:
 *          type: "array"
 *          items:
 *            schema:
 *            $ref: '#/components/schemas/SubscriptionResponse'
 *        nextLink:
 *          type: "string"
 *          example: "The continuation token will be present only if there are additional \"pages\" of plans to retrieve."
*/
export default interface ISubscriptionsResponse {
    subscriptions: ISubscriptionResponse[]
    nextLink: string
}