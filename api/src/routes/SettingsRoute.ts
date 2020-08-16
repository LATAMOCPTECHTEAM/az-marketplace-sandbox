import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";

import { ISettingsService } from "@types";
import { BaseRoute, RouteConfig, RoutePrefix } from "./BaseRoute";

@injectable()
@RoutePrefix("/api/settings")
export default class SettingsRoute extends BaseRoute {

    constructor(@inject("ISettingsService") private settingsService: ISettingsService) {
        super();
    }

    @RouteConfig("get", "/")
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const settings = await this.settingsService.getSettings();
            res.status(200).json(settings || {});
        } catch (error) {
            next(error);
        }
    }

    @RouteConfig("post", "/")
    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.settingsService.updateSettings(req.body);
            res.status(200).json("OK");
        }
        catch (error) {
            next(error);
        }
    }
}