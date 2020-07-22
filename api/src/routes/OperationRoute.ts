import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { IOperationService } from "../types";

@injectable()
@RoutePrefix("/api/operations")
export default class OperationRoute extends BaseRoute {

    constructor(@inject("IOperationService") private operationService: IOperationService) {
        super();
    }

    @RouteConfig("delete", "/:operationId")
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.operationService.delete(req.params.operationId);
            res.status(200).json("OK");
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/resendWebhook/:operationId")
    async resendWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.operationService.sendWebhook(req.params.operationId);
            res.status(200).json("OK");
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/suspend")
    async suspend(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var webhookSent = await this.operationService.simulateSuspend(req.body);
            res.status(200).json(webhookSent ? "OK" : { warning: "Failed to send webhook, please check the application logs." });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/unsubscribe")
    async unsubscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var webhookSent = await this.operationService.simulateUnsubscribe(req.body);
            res.status(200).json(webhookSent ? "OK" : { warning: "Failed to send webhook, please check the application logs." });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/reinstate")
    async reinstate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var webhookSent = await this.operationService.simulateReinstate(req.body);
            res.status(200).json(webhookSent ? "OK" : { warning: "Failed to send webhook, please check the application logs." });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/changePlan")
    async changePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var { webhookSent } = await this.operationService.changePlan(req.body.subscriptionId, req.body.planId, req.body.id, req.body.activityId, req.body.timeStamp);
            res.status(200).json(webhookSent ? "OK" : { warning: "Failed to send webhook, please check the application logs." });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/changeQuantity")
    async changeQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            var { webhookSent } = await this.operationService.changeQuantity(req.body.subscriptionId, req.body.planId, req.body.id, req.body.activityId, req.body.timeStamp);
            res.status(200).json(webhookSent ? "OK" : { warning: "Failed to send webhook, please check the application logs." });
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("get", "/:subscriptionId")
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let operations = await this.operationService.list(req.params.subscriptionId);
            res.status(200).json(operations);
        } catch (error) {
            next(error);
        }
    }

}