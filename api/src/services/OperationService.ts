import { injectable, inject } from "tsyringe";
import * as request from "request-promise";
import { IOperationService, ISettingsService } from "../types";
import SubscriptionSchema, { ISubscription } from "../models/SubscriptionSchema";
import OperationSchema, { IOperation } from "../models/OperationSchema";
import Chance from "chance";
import BadRequestError from "../errors/BadRequest";
import SettingsSchema from "../models/SettingsSchema";

@injectable()
export default class OperationService implements IOperationService {

    constructor(@inject("ISettingsService") private settingsService: ISettingsService) {

    }




    async delete(operationId: string) {
        await OperationSchema.deleteOne({ id: operationId });
    }


    async list(subscriptionId: string): Promise<IOperation[]> {
        var operations = await OperationSchema.find({ subscriptionId: subscriptionId }, null, { sort: { timeStamp: -1 } });
        return operations;
    }


    async confirmChangePlan(subscriptionId: string, operationId: string, planId: string, quantity: string, status: string) {
        var operationModel = await OperationSchema.findOne({ id: operationId });
        var subscriptionModel = await SubscriptionSchema.findOne({ id: subscriptionId });

        operationModel.status = status == "Success" ? "Succeeded" : "Failed";

        await OperationSchema.updateOne({ id: operationModel.id }, operationModel);

        subscriptionModel.planId = planId;
        subscriptionModel.quantity = quantity;

        await SubscriptionSchema.updateOne({ id: subscriptionModel.id }, subscriptionModel);

    }

    async changePlan(subscriptionId: string, planId: string, id?: string, activityId?: string, timeStamp?: string): Promise<IOperation> {
        let settingsModel = await SettingsSchema.findOne({});
        var subscriptionModel = await SubscriptionSchema.findOne({ id: subscriptionId });

        if (subscriptionModel == null) {
            throw new BadRequestError("Subscription Not Found");
        }

        if (!settingsModel.plans.some(plan => plan.planId == planId)) {
            throw new BadRequestError("Plan not found");
        }

        if (subscriptionModel.planId == planId) {
            throw new BadRequestError("Trying to change to the same plan");
        }

        if (subscriptionModel.saasSubscriptionStatus != "Subscribed") {
            throw new BadRequestError("The SaaS subscription status is not Subscribed");
        }

        if (!subscriptionModel.allowedCustomerOperations.some(operation => operation == "Update")) {
            throw new BadRequestError("The update operation for a SaaS subscription is not included in allowedCustomerOperations");
        }

        var chance = new Chance();
        var operationModel: IOperation = new OperationSchema({
            "id": id || chance.guid(),
            "activityId": activityId || chance.guid(),
            "subscriptionId": subscriptionModel.id,
            "offerId": subscriptionModel.offerId,
            "publisherId": subscriptionModel.publisherId,
            "planId": planId,
            "quantity": subscriptionModel.quantity,
            "action": "ChangePlan",
            "timeStamp": timeStamp || new Date().toISOString(),
            "status": "InProgress"
        })

        operationModel = await OperationSchema.create(operationModel);
        this.sendWebhook(operationModel.id).catch(error => { });

        return operationModel;
    }

    async changeQuantity(subscriptionId: string, quantity: string, id?: string, activityId?: string, timeStamp?: string): Promise<IOperation> {
        var subscriptionModel = await SubscriptionSchema.findOne({ id: subscriptionId });

        if (subscriptionModel == null) {
            throw new BadRequestError("Subscription Not Found");
        }

        if (subscriptionModel.quantity == quantity) {
            throw new BadRequestError("Trying to change to the same quantity");
        }

        if (subscriptionModel.saasSubscriptionStatus != "Subscribed") {
            throw new BadRequestError("The SaaS subscription status is not Subscribed");
        }

        if (subscriptionModel.allowedCustomerOperations.some(operation => operation == "Update")) {
            throw new BadRequestError("The update operation for a SaaS subscription is not included in allowedCustomerOperations");
        }

        var chance = new Chance();
        var operationModel: IOperation = new OperationSchema({
            "id": id || chance.guid(),
            "activityId": activityId || chance.guid(),
            "subscriptionId": subscriptionModel.id,
            "offerId": subscriptionModel.offerId,
            "publisherId": subscriptionModel.publisherId,
            "planId": subscriptionModel.planId,
            "quantity": quantity,
            "action": "ChangeQuantity",
            "timeStamp": timeStamp || new Date().toISOString(),
            "status": "InProgress"
        })

        operationModel = await OperationSchema.create(operationModel);
        this.sendWebhook(operationModel.id).catch(error => { });

        return operationModel;
    }



    async simulateUnsubscribe(operation: IOperation) {
        var operationModel = await OperationSchema.create(operation);
        var subscriptionModel = await SubscriptionSchema.findOne({ id: operation.subscriptionId });

        subscriptionModel.saasSubscriptionStatus = "Unsubscribed";

        await SubscriptionSchema.updateOne({ id: subscriptionModel.id }, subscriptionModel);

        this.sendWebhook(operationModel.id)
            .catch(error => { });
    }

    async simulateSuspend(operation: IOperation) {
        var operationModel = await OperationSchema.create(operation);
        var subscriptionModel = await SubscriptionSchema.findOne({ id: operation.subscriptionId });

        subscriptionModel.saasSubscriptionStatus = "Suspended";

        await SubscriptionSchema.updateOne({ id: subscriptionModel.id }, subscriptionModel);

        this.sendWebhook(operationModel.id)
            .catch(error => { });
    }

    async simulateReinstate(operation: IOperation) {
        var operationModel = await OperationSchema.create(operation);
        var subscriptionModel = await SubscriptionSchema.findOne({ id: operation.subscriptionId });

        subscriptionModel.saasSubscriptionStatus = "Subscribed";

        await SubscriptionSchema.updateOne({ id: subscriptionModel.id }, subscriptionModel);

        this.sendWebhook(operationModel.id)
            .catch(error => { });
    }

    async sendWebhook(operationId: string) {
        var settings = await this.settingsService.getSettings();
        var operationModel = await OperationSchema.findOne({ id: operationId });

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
                    "status": operationModel.status
                }
            });
            console.log(`Success calling the webhook API, Operation ${operationModel.id}`);
        } catch (error) {
            console.error(`Error calling the webhook API, Operation ${operationModel.id}: ${error.message}`);
            throw error;
        }
    }
}