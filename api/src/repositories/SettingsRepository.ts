import { injectable, inject } from "tsyringe";
import { ISettingsRepository } from "types";
import { ISettingsSchema } from "schemas";
import { ISettings } from "models";

@injectable()
export default class SettingsRepository implements ISettingsRepository {

    constructor(@inject("SettingsSchema") private settingsSchema: ISettingsSchema) {

    }

    async createOrUpdate(settings: ISettings) {
        var settingsRecord = await this.settingsSchema.findOneAndUpdate({}, settings);
        if (settingsRecord == null) {
            await this.settingsSchema.create(settings);
        }
    }

    async get(): Promise<ISettings> {
        return this.settingsSchema.findOne({});
    }
}