import { injectable, inject } from "tsyringe";
import { IOperationRepository } from "types";
import { IOperationSchema } from "schemas";
import { IOperation } from "models";

@injectable()
export default class OperationRepository implements IOperationRepository {

    constructor(
        @inject("OperationSchema") private operationSchema: IOperationSchema) {

    }

    async getById(id: string): Promise<IOperation> {
        return this.operationSchema.findOne({ id: id });
    }

    async getBySubscriptionAndId(subscriptionId: string, operationId: string): Promise<IOperation> {
        return this.operationSchema.findOne({ id: operationId, subscriptionId: subscriptionId });
    }

    async delete(operationId: string) {
        await this.operationSchema.deleteOne({ id: operationId });
    }

    async listBySubscriptionDescendingByTimestamp(subscriptionId: string): Promise<IOperation[]> {
        return this.operationSchema.find({ subscriptionId: subscriptionId }, null, { sort: { timeStamp: -1 } });
    }

    async create(operation: IOperation): Promise<void> {
        await this.operationSchema.create(operation);
    }

    async updateOne(id: string, operation: IOperation): Promise<void> {
        return this.operationSchema.updateOne({ id: id }, operation);
    }
}