const dotenv = require("dotenv");
import { injectable, inject } from "tsyringe";

import { IServer, ISettingsService } from "../types";

// TODO Change to dependency injection
import mongoose, { Mongoose } from "mongoose";
import SettingsSchema, { ISettings } from "../models/SettingsSchema";

@injectable()
export default class SettingsService implements ISettingsService {

    constructor() {

    }

    async updateSettings(settings: ISettings) {
        var settings = await SettingsSchema.findOneAndUpdate({}, settings);
        return settings;
    }

    async getSettings(): Promise<ISettings> {
        var settings = await SettingsSchema.findOne({});
        return settings;
    }

    

}