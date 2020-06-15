import { Request, Response, NextFunction } from "express";
import { BaseRoute } from "../BaseRoute";

export default interface IMarketplaceRoute extends BaseRoute {
    /**
    * POST /api/saas/subscriptions/resolve 
    * @swagger
    * /api/saas/subscriptions/resolve:
    *   post:
    *     tags:
    *     - "Resolve"
    *     summary: "Resolve a Subscription"
    *     description: "<p>The resolve endpoint enables the publisher to exchange the marketplace purchase identification token (referred here as token) to a persistent purchased SaaS subscription ID and its details.</p>
    *                   <br/>
    *                   <p>When a customer is redirected to the partner's Landing Page URL, the customer identification token is passed as token parameter in this URL call. The partner is expected to use this token and make a request to resolve it. 
    *                      The resolve API response contains the SaaS subscription ID and other details to uniquely identify the purchase. The token provided with the Landing page URL call is usually valid for 24 hours. 
    *                      If the token that you receive has already expired, we recommend that you provide the following guidance to the end customer:</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#resolve-a-purchased-subscription\" target=\"_blank\">Official Documentation</a>"
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
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
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
    *     description: "<p>Retrieves a list of all purchased SaaS subscriptions for all offers published by the publisher in marketplace. 
    *                   SaaS subscriptions in all possible statuses will be returned. Unsubscribed SaaS subscriptions are also returned, as this information is not deleted on Microsoft side.</p>
    *                   <br/>
    *                   <p>This API returns paginated results. Page size is 100.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#get-list-of-all-subscriptions\" target=\"_blank\">Official Documentation</a>"
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
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
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
    *     description: "<p>Retrieves a specified purchased SaaS subscription for a SaaS offer published in the marketplace by the publisher. 
    *                      Use this call to get all available information for a specific SaaS subscription by its ID rather than calling the API for getting list of all subscriptions.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#get-subscription\" target=\"_blank\">Official Documentation</a>"
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
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
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

    /**
    * POST /api/saas/subscriptions/{subscriptionId}/activate 
    * @swagger
    * /api/saas/subscriptions/{subscriptionId}/activate:
    *   post:
    *     tags:
    *     - "Activate"
    *     summary: "Activate a Subscription"
    *     description: "<p>This state is the steady state of a provisioned SaaS subscription. Once the Activate Subscription API call is processed on Microsoft side, the SaaS subscription is marked as Subscribed. 
    *                      The SaaS service is now ready to be used by the customer on the publisher's side, and the customer is billed.</p>
    *                   <br/>
    *                   <p>When the SaaS subscription is already active, and the customer chooses to launch Manage SaaS experience from the Azure portal or M365 Admin Center, Landing page URL is again called by Microsoft with token parameter, same as in the activate flow. 
    *                      The publisher should distinguish between new purchases and management of existing SaaS accounts and handle this landing page URL call accordingly.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#active-subscribed\" target=\"_blank\">Official Documentation</a>"
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
    *       required: true
    *       schema:
    *         type: string
    *     - in: query
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
    *     requestBody:
    *       description: Optional description in *Markdown*
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               planId:
    *                 type: string
    *                 example: planId
    *               quantity:
    *                 type: string
    *                 example: quantity
    *     responses:
    *       200:
    *         description: "Activates the subscription."
    *       400:
    *         description: "Bad request: validation failures."
    *       403:
    *         description: "Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher."
    *       404:
    *         description: "Not Found."
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
    activate(req: Request, res: Response, next: NextFunction);

    /**
    * GET /api/saas/subscriptions/{subscriptionId}/listAvailablePlans
    * @swagger
    * /api/saas/subscriptions/{subscriptionId}/listAvailablePlans:
    *   get:
    *     tags:
    *     - "Plans"
    *     summary: "List available plans"
    *     description: "<p>Retrieves all plans for a SaaS offer identified by the subscriptionId of a specific purchase of this offer. 
    *                      Use this call to get a list of all private and public plans that the beneficiary of a SaaS subscription can update for the subscription. 
    *                      The plans returned will be available in the same geography as the already purchased plan.</p>
    *                   <br/>
    *                   <p>This call returns a list of plans available for that customer in addition to the one already purchased. The list can be presented to an end customer on the publisher site. 
    *                      An end customer can change the subscription plan to any one of the plans in the returned list. Changing plan to one not listed in the list will fail.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#get-list-of-all-subscriptions\" target=\"_blank\">Official Documentation</a>"
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
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/ListAvailablePlansResponse'
    *       403:
    *         description: Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher.
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
    listAvailablePlans(req: Request, res: Response, next: NextFunction);

    /**
    * PATCH /api/saas/subscriptions/{subscriptionId}
    * @swagger
    * /api/saas/subscriptions/{subscriptionId}:
    *   patch:
    *     tags:
    *     - "Change Plan"
    *     summary: "Change the plan on the subscription"
    *     description: "<p>Update the existing plan purchased for a SaaS subscription to a new plan (public or private). The publisher must call this API when a plan is changed on the publisher side for a SaaS subscription purchased in marketplace.</p>
    *                   <br/>
    *                   <p>This API can be called only for Active subscriptions. Any plan can be changed to any other existing plan (public or private) but not to itself. For private plans, the customer's tenant must be defined as part of plan's audience in Partner Center.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#change-the-plan-on-the-subscription\" target=\"_blank\">Official Documentation</a>"
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
    *       required: true
    *       schema:
    *         type: string
    *     - in: query
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
    *     requestBody:
    *       description: Optional description in *Markdown*
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               planId:
    *                 type: string
    *                 description: "The ID of the new plan to be purchased"
    *                 example: gold
    *     responses:
    *       200:
    *         description: "<p>The request to change plan has been accepted and handled asynchronously. The partner is expected to poll the Operation-Location URL to determine a success or failure of the change plan request. 
    *                          Polling should be done every several seconds until the final status of Failed, Succeed, or Conflict is received for the operation. 
    *                          Final operation status should be returned quickly, but can take several minutes in some cases.</p>
    *                       <br/>
    *                       <p>The partner will also get webhook notification when the action is ready to be completed successfully on the Marketplace side. And only then the publisher should make the plan change on the publisher side.</p>"
    *         headers:
    *           Operation-Location:
    *             description: "URL to get the operation's status. For example, https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=2018-08-31."
    *       400:
    *         description: "
    *           Bad request: validation failures.
    *           <ul>
    *             <li>The new plan does not exist or is not available for this specific SaaS subscription.</li>
    *             <li>Trying to change to the same plan.</li>
    *             <li>The SaaS subscription status is not Subscribed.</li>
    *             <li>The update operation for a SaaS subscription is not included in allowedCustomerOperations.</li>
    *           </ul>
    *           "
    *       403:
    *         description: "Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher."
    *       404:
    *         description: "Not Found."
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
   /**
    * PATCH /api/saas/subscriptions/{subscriptionId}
    * @swagger
    * /api/saas/subscriptions/{subscriptionId}:
    *   patch:
    *     tags:
    *     - "Change Quantity"
    *     summary: "Change the quantity on the subscription"
    *     description: "<p>Update the existing plan purchased for a SaaS subscription to a new plan (public or private). The publisher must call this API when a plan is changed on the publisher side for a SaaS subscription purchased in marketplace.</p>
    *                   <br/>
    *                   <p>This API can be called only for Active subscriptions. Any plan can be changed to any other existing plan (public or private) but not to itself. For private plans, the customer's tenant must be defined as part of plan's audience in Partner Center.</p>
    *                   <br/>
    *                   <a href=\"https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#change-the-plan-on-the-subscription\" target=\"_blank\">Official Documentation</a>"
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
    *       required: true
    *       schema:
    *         type: string
    *     - in: query
    *       name: api-version
    *       description: "The version of the API to use for this request. The Sandbox API currently validates against the API Version=2018-08-31"
    *       required: true
    *       example: "2018-08-31"
    *     requestBody:
    *       description: Optional description in *Markdown*
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               planId:
    *                 type: string
    *                 description: "The ID of the new plan to be purchased"
    *                 example: gold
    *     responses:
    *       200:
    *         description: "<p>The request to change plan has been accepted and handled asynchronously. The partner is expected to poll the Operation-Location URL to determine a success or failure of the change plan request. 
    *                          Polling should be done every several seconds until the final status of Failed, Succeed, or Conflict is received for the operation. 
    *                          Final operation status should be returned quickly, but can take several minutes in some cases.</p>
    *                       <br/>
    *                       <p>The partner will also get webhook notification when the action is ready to be completed successfully on the Marketplace side. And only then the publisher should make the plan change on the publisher side.</p>"
    *         headers:
    *           Operation-Location:
    *             description: "URL to get the operation's status. For example, https://marketplaceapi.microsoft.com/api/saas/subscriptions/<subscriptionId>/operations/<operationId>?api-version=2018-08-31."
    *       400:
    *         description: "
    *           Bad request: validation failures.
    *           <ul>
    *             <li>The new plan does not exist or is not available for this specific SaaS subscription.</li>
    *             <li>Trying to change to the same plan.</li>
    *             <li>The SaaS subscription status is not Subscribed.</li>
    *             <li>The update operation for a SaaS subscription is not included in allowedCustomerOperations.</li>
    *           </ul>
    *           "
    *       403:
    *         description: "Unauthorized. The authentication token wasn't provided or is invalid, or the request is attempting to access an acquisition that doesn't belong to the current publisher."
    *       404:
    *         description: "Not Found."
    *       500:
    *         description: "Internal Server Error"
    *         content:
    *             application/json:
    *               schema:
    *                 $ref: '#/components/schemas/InternalServerError'
    */
   changePlanOrQuantity(req: Request, res: Response, next: NextFunction);
}