import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";


import BadRequestError from "@errors/BadRequest";
import Config from "@Config";
import IMarketplaceRoute from "./interfaces/IMarketplaceRoute"
import { BaseRoute, RouteConfig, RoutePrefix } from "./BaseRoute";
import { IInternalServerErrorResponse, IListAvailablePlans, IOperationResponse, IResolveResponse, ISubscriptionResponse, ISubscriptionsResponse } from "./interfaces/models";
import { IOperationService, ISettingsService, ISubscriptionService } from "@types";

@injectable()
@RoutePrefix("/api/saas/subscriptions")
export default class MarketplaceRoute extends BaseRoute implements IMarketplaceRoute {

    constructor(
        @inject("ISubscriptionService") private subscriptionService: ISubscriptionService,
        @inject("IOperationService") private operationService: IOperationService,
        @inject("ISettingsService") private settingsService: ISettingsService) {
        super();
    }

    validateApiVersion(req: Request) {
        if (req.query["api-version"] !== Config.saasAPIVersion) {
            throw new Error(`apiVersion parameter doesn't match to the current version implemented of the Sandbox (${Config.saasAPIVersion})`)
        }
    }

    private handleError(error: Error, res: Response) {
        let statusCode = 500;
        if (error.name === "BadRequestError") {
            statusCode = 400;
        }
        const response: IInternalServerErrorResponse = {
            error: {
                code: error.name,
                message: error.message
            }
        }
        res.status(statusCode).json(response);
    }

    @RouteConfig("get", "/:subscriptionId/listAvailablePlans")
    async listAvailablePlans(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            const settings = await this.settingsService.getSettings();
            if (!settings) {
                res.status(404);
                return;
            }
            const response: IListAvailablePlans = {
                plans: settings.plans.map(plan => {
                    return {
                        planId: plan.planId,
                        displayName: plan.displayName,
                        isPrivate: plan.isPrivate
                    };
                })
            }
            res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("post", "/resolve")
    async resolve(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            const token = req.headers["x-ms-marketplace-token"].toString();
            const subscription = await this.subscriptionService.getSubscription(token);
            if (!subscription) {
                res.status(404);
                return;
            }
            const response: IResolveResponse = {
                id: subscription.id,
                subscriptionName: subscription.name,
                offerId: subscription.offerId,
                planId: subscription.planId,
                quantity: subscription.quantity
            };
            res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("get", "/")
    async getSubscriptions(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            const skip: any = req.query.skip;
            const { subscriptions, nextSkip } = await this.subscriptionService.listSubscriptionPaged(parseInt(skip) || 0);
            const response: ISubscriptionsResponse = {
                subscriptions: subscriptions.map(subscription => {
                    const subscriptionResponse: ISubscriptionResponse = {
                        id: subscription.id,
                        name: subscription.name,
                        publisherId: subscription.publisherId,
                        offerId: subscription.offerId,
                        planId: subscription.planId,
                        quantity: subscription.quantity,
                        beneficiary: subscription.beneficiary,
                        purchaser: subscription.purchaser,
                        term: subscription.term,
                        allowedCustomerOperations: subscription.allowedCustomerOperations,
                        sessionMode: subscription.sessionMode,
                        isFreeTrial: subscription.isFreeTrial,
                        isTest: subscription.isTest,
                        sandboxType: subscription.sandboxType,
                        saasSubscriptionStatus: subscription.saasSubscriptionStatus
                    };
                    return subscriptionResponse;
                }),
                nextLink: nextSkip ? `${req.host}${req.originalUrl}?skip=${nextSkip}&apiVersion=${Config.saasAPIVersion}` : ""
            }
            res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("get", "/:subscriptionId")
    async getSubscription(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            const subscription = await this.subscriptionService.getSubscription(req.params.subscriptionId);
            if (!subscription) {
                res.status(404);
                return;
            }
            const response: ISubscriptionResponse = {
                id: subscription.id,
                name: subscription.name,
                publisherId: subscription.publisherId,
                offerId: subscription.offerId,
                planId: subscription.planId,
                quantity: subscription.quantity,
                beneficiary: subscription.beneficiary,
                purchaser: subscription.purchaser,
                term: subscription.term,
                allowedCustomerOperations: subscription.allowedCustomerOperations,
                sessionMode: subscription.sessionMode,
                isFreeTrial: subscription.isFreeTrial,
                isTest: subscription.isTest,
                sandboxType: subscription.sandboxType,
                saasSubscriptionStatus: subscription.saasSubscriptionStatus
            }
            res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("patch", "/:subscriptionId/operations/:operationId")
    async patchOperation(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            await this.operationService.confirmChangePlan(req.params.subscriptionId, req.params.operationId, req.body.planId, req.body.quantity, req.body.status);
            res.status(200).json("OK");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("post", "/:subscriptionId/activate")
    async activate(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            await this.subscriptionService.activateSubscription(req.params.subscriptionId, req.body.planId, req.body.quantity);
            res.status(200).json("OK");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("patch", "/:subscriptionId")
    async changePlanOrQuantity(req: Request, res: Response): Promise<void> {
        try {
            this.validateApiVersion(req);
            if (req.body.planId && req.body.quantity) {
                throw new BadRequestError("Either the plan or quantity of seats can be changed at one time, not both");
            }
            let id: string = null;
            if (req.body.quantity) {
                ({ id } = await this.operationService.changeQuantity(req.params.subscriptionId, req.body.quantity));
            } else {
                ({ id } = await this.operationService.changePlan(req.params.subscriptionId, req.body.planId));
            }
            const operationLocation = `${req.host}/api/saas/subscriptions/${req.params.subscriptionId}/operations/${id}?apiVersion=${Config.saasAPIVersion}`;
            res.setHeader("Operation-Location", operationLocation);
            res.status(200).json("OK");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    @RouteConfig("get", "/:subscriptionId/operations/:operationId")
    async getOperation(req: Request, res: Response) {
        try {
            this.validateApiVersion(req);
            const operation = await this.operationService.get(req.params.subscriptionId, req.params.operationId);
            const response: IOperationResponse = {
                id: operation.id,
                action: operation.action,
                activityId: operation.activityId,
                offerId: operation.offerId,
                planId: operation.planId,
                publisherId: operation.publisherId,
                quantity: operation.quantity,
                status: operation.status,
                subscriptionId: operation.subscriptionId,
                timeStamp: operation.timeStamp
            }
            res.status(200).json(response);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}