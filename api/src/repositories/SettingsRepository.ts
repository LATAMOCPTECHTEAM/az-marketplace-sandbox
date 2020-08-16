import { inject, injectable } from "tsyringe";

import { ISettings } from "@models";
import { ISettingsRepository } from "@types";
import { ISettingsSchema } from "@schemas";

@injectable()
export default class SettingsRepository implements ISettingsRepository {

    constructor(@inject("SettingsSchema") private settingsSchema: ISettingsSchema) { }

    async createOrUpdate(settings: ISettings) {
        const settingsRecord = await this.settingsSchema.findOneAndUpdate({}, settings);
        if (settingsRecord === null) {
            await this.settingsSchema.create(settings);
        }
    }

    async get(): Promise<ISettings> {
        return this.settingsSchema.findOne({});
    }
}