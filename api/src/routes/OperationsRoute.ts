import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { IOperationService } from "../types";

@injectable()
@RoutePrefix("/operations")
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
        await this.operationService.simulateSuspend(req.body);
        res.status(200).json("OK");
    }

    @RouteConfig("post", "/changePlan")
    async changePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.operationService.simulateChangePlan(req.body);
        res.status(200).json("OK");
    }

    @RouteConfig("get", "/:subscriptionId")
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        let operations = await this.operationService.list(req.params.subscriptionId);
        res.status(200).json(operations);
    }

}