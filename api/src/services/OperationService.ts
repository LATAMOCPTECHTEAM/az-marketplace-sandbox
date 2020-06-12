import { injectable, inject } from "tsyringe";
import * as request from "request-promise";
import { IOperationService, ISettingsService } from "../types";
import SubscriptionSchema, { ISubscription } from "../models/SubscriptionSchema";
import OperationSchema, { IOperation } from "../models/OperationSchema";

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

    async simulateChangePlan(operation: IOperation) {
        var operationModel = await OperationSchema.create(operation);

        this.sendWebhook(operationModel.id)
            .catch(error => { });
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
            })
            console.log(`Success calling the webhook API, Operation ${operationModel.id}`);
        } catch (error) {
            console.error(`Success calling the webhook API, Operation ${operationModel.id}: ${error.message}`);
            throw error;
        }
    }
}