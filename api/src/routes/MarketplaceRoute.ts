import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";
import { ISubscriptionService, IOperationService, ISettingsService } from "../types";
import IMarketplaceRoute from "./interfaces/IMarketplaceRoute"
import IResolveResponse from "./interfaces/models/IResolveResponse";
import IInternalServerErrorResponse from "./interfaces/models/IInternalServerErrorResponse";
import ISubscriptionResponse from "./interfaces/models/ISubscriptionResponse";
import ISubscriptionsResponse from "./interfaces/models/ISubscriptionsResponse";
import IListAvailablePlans from "./interfaces/models/IListAvailablePlansResponse";

@injectable()
@RoutePrefix("/api/saas/subscriptions")
export default class MarketplaceRoute extends BaseRoute implements IMarketplaceRoute {

    constructor(
        @inject("ISubscriptionService") private subscriptionService: ISubscriptionService,
        @inject("IOperationService") private operationService: IOperationService,
        @inject("ISettingsService") private settingsService: ISettingsService) {
        super();
    }

    @RouteConfig("get", "/:subscriptionId/listAvailablePlans")
    async listAvailablePlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let settings = await this.settingsService.getSettings();
            if (settings == null) {
                res.status(404);
                return;
            }
            let response: IListAvailablePlans = {
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
            let response: IInternalServerErrorResponse = {
                error: {
                    code: error.name,
                    message: error.message
                }
            }
            res.status(500).json(response);
        }
    }


    @RouteConfig("post", "/resolve")
    async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let token = req.headers["x-ms-marketplace-token"].toString();
            let subscription = await this.subscriptionService.getSubscription(token);
            if (subscription == null) {
                res.status(404);
                return;
            }
            let response: IResolveResponse = {
                id: subscription.id,
                subscriptionName: subscription.name,
                offerId: subscription.offerId,
                planId: subscription.planId,
                quantity: subscription.quantity
            };
            res.status(200).json(response);
        } catch (error) {
            let response: IInternalServerErrorResponse = {
                error: {
                    code: error.name,
                    message: error.message
                }
            }
            res.status(500).json(response);
        }
    }

    @RouteConfig("get", "/")
    async getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let skip: any = req.query["skip"];
            let { subscriptions, nextSkip } = await this.subscriptionService.listSubscriptionPaged(parseInt(skip) || 0);
            let response: ISubscriptionsResponse = {
                subscriptions: subscriptions.map(subscription => {
                    let subscriptionResponse: ISubscriptionResponse = {
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
                nextLink: nextSkip ? `${req.host}${req.originalUrl}?skip=${nextSkip}` : ""
            }
            res.status(200).json(response);
        } catch (error) {
            let response: IInternalServerErrorResponse = {
                error: {
                    code: error.name,
                    message: error.message
                }
            }
            res.status(500).json(response);
        }
    }

    @RouteConfig("get", "/:subscriptionId")
    async getSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let subscription = await this.subscriptionService.getSubscription(req.params.subscriptionId);
            if (subscription == null) {
                res.status(404);
                return;
            }
            let response: ISubscriptionResponse = {
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
            let response: IInternalServerErrorResponse = {
                error: {
                    code: error.name,
                    message: error.message
                }
            }
            res.status(500).json(response);
        }
    }

    @RouteConfig("patch", "/:subscriptionId/operations/:operationId")
    async patchOperation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.operationService.confirmChangePlan(req.params.subscriptionId, req.params.operationId, req.body.planId, req.body.quantity, req.body.status);
            res.status(200).json("OK");
        } catch (error) {
            let response: IInternalServerErrorResponse = {
                error: {
                    code: error.name,
                    message: error.message
                }
            }
            res.status(500).json(response);
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