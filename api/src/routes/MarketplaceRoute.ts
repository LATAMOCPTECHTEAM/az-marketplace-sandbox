import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { ISubscriptionService } from "../types";

@injectable()
@RoutePrefix("/api/saas/subscriptions")
export default class MarketplaceRoute extends BaseRoute {

    constructor(@inject("ISubscriptionService") private subscriptionService: ISubscriptionService) {
        super();
    }

    @RouteConfig("post", "/resolve")
    async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var token = req.headers["x-ms-marketplace-token"].toString();
            let subscription = await this.subscriptionService.getSubscription(token);
            res.status(200).json({
                id: subscription.id,
                subscriptionName: subscription.name,
                offerId: subscription.offerId,
                planId: subscription.planId,
                quantity: subscription.quantity
            });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("get", "/:subscriptionId")
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let subscription = await this.subscriptionService.getSubscription(req.params.subscriptionId);
            delete subscription.__v;
            delete subscription._id;
            res.status(200).json(subscription);
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/:subscriptionId/activate")
    async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.subscriptionService.activateSubscription(req.params.subscriptionId, req.body.planId, req.body.quantity);
            res.status(200).json("OK");
        } catch (error) {
            next(error);
        }
    }
}