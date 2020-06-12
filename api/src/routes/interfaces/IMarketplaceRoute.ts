import { Request, Response, NextFunction } from "express";
import { BaseRoute } from "../BaseRoute";

export default interface IMarketplaceRoute extends BaseRoute {
    /**
    * GET /api/saas/subscriptions/resolve 
    * @swagger
    * /api/saas/subscriptions/resolve:
    *   post:
    *     tags:
    *     - "Resolve"
    *     summary: "Resolve a Subscription"
    *     description: "The resolve endpoint enables the publisher to resolve a marketplace token to a persistent resource ID. The resource ID is the unique identifier for a SaaS subscription. When a user is redirected to a partner's website, the URL contains a token in the query parameters. The partner is expected to use this token and make a request to resolve it. The response contains the unique SaaS subscription ID, name, offer ID, and plan for the resource. This token is valid for one hour only."
    *     parameters:
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-requestid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-correlationid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "The token query parameter in the URL when the user is redirected to the SaaS partner's website from Azure (for example: https://contoso.com/signup?token=..). Note: The URL decodes the token value from the browser before using it."
    *       name: x-ms-marketplace-token
    *       required: true
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) Get JSON web token (JWT) bearer token. For example: \"Bearer <access_token>\". https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-registration#get-a-token-based-on-the-azure-ad-app"
    *       name: authorization
    *       schema:
    *         type: string
    *     - in: query
    *       name: apiVersion
    *       description: "(Ignored by the Sandbox) The version of the operation to use for this request. (Not validated in the Sandbox API)"
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/ResolveResponse'
    *       400:
    *         description: Bad request. x-ms-marketplace-token is missing, malformed, or expired.
    *       403:
    *         description: Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher.
    *       404:
    *         description: Not Found.
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
    resolve(req: Request, res: Response, next: NextFunction);

    /**
    * GET /api/saas/subscriptions
    * @swagger
    * /api/saas/subscriptions:
    *   get:
    *     tags:
    *     - "Subscriptions"
    *     summary: "List Subscriptions"
    *     description: "Lists all the SaaS subscriptions for a publisher."
    *     parameters:
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-requestid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-correlationid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) Get JSON web token (JWT) bearer token. For example: \"Bearer <access_token>\". https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-registration#get-a-token-based-on-the-azure-ad-app"
    *       name: authorization
    *       schema:
    *         type: string
    *     - in: query
    *       name: apiVersion
    *       description: "(Ignored by the Sandbox) The version of the operation to use for this request. (Not validated in the Sandbox API)"
    *     - in: query
    *       name: skip
    *       description: "Skip parameter used for pagination, the complete url of pagination will be returned by the nextLink property in the response"
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/SubscriptionsResponse'
    *       403:
    *         description: Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher.
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
    getSubscriptions(req: Request, res: Response, next: NextFunction);

    /**
    * GET /api/saas/subscriptions/{subscriptionId}
    * @swagger
    * /api/saas/subscriptions/{subscriptionId}:
    *   get:
    *     tags:
    *     - "Subscriptions"
    *     summary: "Get Subscription"
    *     description: "Gets the specified SaaS subscription. Use this call to get license information and plan information."
    *     parameters:
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for tracking the request from the client, preferably a GUID. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-requestid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) A unique string value for operation on the client. This parameter correlates all events from client operation with events on the server side. If this value isn't provided, one will be generated and provided in the response headers."
    *       name: x-ms-correlationid
    *       schema:
    *         type: string
    *     - in: header
    *       description: "(Ignored by the Sandbox) Get JSON web token (JWT) bearer token. For example: \"Bearer <access_token>\". https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-registration#get-a-token-based-on-the-azure-ad-app"
    *       name: authorization
    *       schema:
    *         type: string
    *     - in: path
    *       description: "A unique identifier of the SaaS subscription that's obtained after resolving the token via Resolve API."
    *       name: subscriptionId
    *       schema:
    *         type: string
    *       required: true
    *     - in: query
    *       name: apiVersion
    *       description: "(Ignored by the Sandbox) The version of the operation to use for this request. (Not validated in the Sandbox API)"
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/SubscriptionResponse'
    *       403:
    *         description: Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher.
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
    getSubscription(req: Request, res: Response, next: NextFunction);

}