import { injectable, inject } from "tsyringe";
import Chance from "chance";
import * as request from "request-promise";
import { IOperationService, ISubscriptionRepository, ISettingsRepository, IOperationRepository } from "types";
import { IOperation } from "models";
import { ESubscriptionStatus } from "../enums";
import { BadRequestError, NotFoundError } from "../errors";

@injectable()
export default class OperationService implements IOperationService {

    constructor(
        @inject("ISubscriptionRepository") private subscriptionRepository: ISubscriptionRepository,
        @inject("ISettingsRepository") private settingsRepository: ISettingsRepository,
        @inject("IOperationRepository") private operationRepository: IOperationRepository) {
    }

    async get(subscriptionId: string, operationId: string): Promise<IOperation> {
        let operation = await this.operationRepository.getBySubscriptionAndId(subscriptionId, operationId);

        if (!operation) {
            throw new NotFoundError("Operation not Found.");
        }
        return operation;
    }

    async delete(operationId: string) {
        return this.operationRepository.delete(operationId);
    }

    async list(subscriptionId: string): Promise<IOperation[]> {
        return this.operationRepository.listBySubscriptionDescendingByTimestamp(subscriptionId);;
    }

    async confirmChangePlan(subscriptionId: string, operationId: string, planId: string, quantity: string, status: string) {
        var operation = await this.operationRepository.getById(operationId);
        var subscription = await this.subscriptionRepository.getById(subscriptionId);

        operation.status = status == "Success" ? "Succeeded" : "Failed";

        await this.operationRepository.updateOne(operation.id, operation);

        subscription.planId = planId;
        subscription.quantity = quantity;

        await this.subscriptionRepository.updateOne(subscription.id, subscription);
    }

    async changePlan(subscriptionId: string, planId: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }> {
        let settings = await this.settingsRepository.get();
        var subscription = await this.subscriptionRepository.getById(subscriptionId);

        if (subscription == null) {
            throw new BadRequestError("Subscription Not Found");
        }

        if (!settings.plans.some(plan => plan.planId == planId)) {
            throw new BadRequestError("Plan not found");
        }

        if (subscription.planId == planId) {
            throw new BadRequestError("Trying to change to the same plan");
        }

        if (subscription.saasSubscriptionStatus != "Subscribed") {
            throw new BadRequestError("The SaaS subscription status is not Subscribed");
        }

        if (!subscription.allowedCustomerOperations.some(operation => operation == "Update")) {
            throw new BadRequestError("The update operation for a SaaS subscription is not included in allowedCustomerOperations");
        }

        var chance = new Chance();
        var operationModel: IOperation = {
            "id": id || chance.guid(),
            "activityId": activityId || chance.guid(),
            "subscriptionId": subscription.id,
            "offerId": subscription.offerId,
            "publisherId": subscription.publisherId,
            "planId": planId,
            "quantity": subscription.quantity,
            "action": "ChangePlan",
            "timeStamp": timeStamp || new Date().toISOString(),
            "status": "InProgress"
        }

        await this.operationRepository.create(operationModel);

        try {
            await this.sendWebhook(operationModel.id)
            return {
                id: operationModel.id,
                webhookSent: true
            }
        } catch (error) {
            return {
                id: operationModel.id,
                webhookSent: false
            }
        }
    }

    async changeQuantity(subscriptionId: string, quantity: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }> {
        var subscription = await this.subscriptionRepository.getById(subscriptionId);

        if (subscription == null) {
            throw new BadRequestError("Subscription Not Found");
        }

        if (subscription.quantity == quantity) {
            throw new BadRequestError("Trying to change to the same quantity");
        }

        if (subscription.saasSubscriptionStatus != "Subscribed") {
            throw new BadRequestError("The SaaS subscription status is not Subscribed");
        }

        if (subscription.allowedCustomerOperations.some(operation => operation == "Update")) {
            throw new BadRequestError("The update operation for a SaaS subscription is not included in allowedCustomerOperations");
        }

        var chance = new Chance();
        var operation: IOperation = {
            "id": id || chance.guid(),
            "activityId": activityId || chance.guid(),
            "subscriptionId": subscription.id,
            "offerId": subscription.offerId,
            "publisherId": subscription.publisherId,
            "planId": subscription.planId,
            "quantity": quantity,
            "action": "ChangeQuantity",
            "timeStamp": timeStamp || new Date().toISOString(),
            "status": "InProgress"
        };

        await this.operationRepository.create(operation);

        try {
            await this.sendWebhook(operation.id)
            return {
                id: operation.id,
                webhookSent: true
            }
        } catch (error) {
            return {
                id: operation.id,
                webhookSent: false
            }
        }
    }

    async simulateUnsubscribe(operation: IOperation): Promise<boolean> {
        await this.operationRepository.create(operation);
        var subscription = await this.subscriptionRepository.getById(operation.subscriptionId);

        subscription.saasSubscriptionStatus = ESubscriptionStatus.Unsubscribed;

        await this.subscriptionRepository.updateOne(subscription.id, subscription);

        try {
            this.sendWebhook(operation.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    async simulateSuspend(operation: IOperation): Promise<boolean> {
        await this.operationRepository.create(operation);
        var subscription = await this.subscriptionRepository.getById(operation.subscriptionId);

        subscription.saasSubscriptionStatus = ESubscriptionStatus.Suspended;

        await this.subscriptionRepository.updateOne(subscription.id, subscription);

        try {
            this.sendWebhook(operation.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    async simulateReinstate(operation: IOperation): Promise<boolean> {
        await this.operationRepository.create(operation);
        var subscription = await this.subscriptionRepository.getById(operation.subscriptionId);

        subscription.saasSubscriptionStatus = ESubscriptionStatus.Subscribed;

        await this.subscriptionRepository.updateOne(subscription.id, subscription);

        try {
            this.sendWebhook(operation.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    async sendWebhook(operationId: string) {
        var settings = await this.settingsRepository.get();
        var operationModel = await this.operationRepository.getById(operationId);

        try {
            var response = await request.post(settings.webhookUrl, {
                resolveWithFullResponse: true,
                json: true,
                strictSSL: false,
                body: {
                    "id": operationModel.id,
                    "activityId": operationModel.activityId,
                    "subscriptionId": operationModel.subscriptionId,
                    "offerId": operationModel.offerId,
                    "publisherId": operationModel.publisherId,
                    "planId": operationModel.planId,
                    "quantity": operationModel.quantity,
                    "action": operationModel.action,
                    "timeStamp": operationModel.timeStamp,
                    "status": operationModel.status == "Succeed" ? "Success" : "InProgress"
                }
            });
            console.log(`Success calling the webhook API, Operation ${operationModel.id}`);
        } catch (error) {
            console.error(`Error calling the webhook API, Operation ${operationModel.id}: ${error.message}`);
            throw error;
        }
    }
}