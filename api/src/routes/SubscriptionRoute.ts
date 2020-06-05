import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { ISubscriptionService } from "../types";

@injectable()
@RoutePrefix("/subscriptions")
export default class SubscriptionRoute extends BaseRoute {

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

    @RouteConfig("delete", "/:id")
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.subscriptionService.deleteSubscription(req.params.id);
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