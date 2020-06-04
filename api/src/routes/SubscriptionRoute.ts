import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { ISubscriptionService } from "../types";

@injectable()
@RoutePrefix("/subscriptions")
export default class SubscriptionRoute extends BaseRoute {
    subscriptions = [
        {
            "id": "<guid>",
            "name": "Contoso Cloud Solution",
            "publisherId": "contoso",
            "offerId": "offer1",
            "planId": "silver",
            "quantity": "10",
            "beneficiary": { // Tenant, object id and email address for which SaaS subscription is purchased.
                "emailId": "<email>",
                "objectId": "<guid>",
                "tenantId": "<guid>"
            },
            "purchaser": { // Tenant, object id and email address that purchased the SaaS subscription. These could be different for reseller scenario
                "emailId": "<email>",
                "objectId": "<guid>",
                "tenantId": "<guid>"
            },
            "term": {
                "startDate": "2019-05-31",
                "endDate": "2019-06-29",
                "termUnit": "P1M"
            },
            "allowedCustomerOperations": [
                "Read" // Possible Values: Read, Update, Delete.
            ], // Indicates operations allowed on the SaaS subscription. For CSP-initiated purchases, this will always be Read.
            "sessionMode": "None", // Possible Values: None, DryRun (Dry Run indicates all transactions run as Test-Mode in the commerce stack)
            "isFreeTrial": true, // true - the customer subscription is currently in free trial, false - the customer subscription is not currently in free trial.(optional field - default false)
            "isTest": false, //indicating whether the current subscription is a test asset
            "sandboxType": "None", // Possible Values: None, Csp (Csp sandbox purchase)
            "saasSubscriptionStatus": "Subscribed" // Indicates the status of the operation: [NotStarted, PendingFulfillmentStart, Subscribed, Suspended, Unsubscribed]
        }
    ]
    constructor(@inject("ISubscriptionService") private subscriptionService: ISubscriptionService) {
        super();
    }

    @RouteConfig("get", "/:id")
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        let subscription = await this.subscriptionService.getSubscription(req.params.id);
        delete subscription.__v;
        delete subscription._id;
        res.status(200).json(subscription);
    }

    @RouteConfig("post", "/")
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.subscriptionService.createSubscription(req.body);
        res.status(200).json("OK");
    }

    @RouteConfig("put", "/")
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.subscriptionService.updateSubscription(req.body);
        res.status(200).json("OK");
    }

    @RouteConfig("get", "/")
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        let subscriptions = await this.subscriptionService.listSubscription();
        res.status(200).json({
            subscriptions: subscriptions
        });
    }

}