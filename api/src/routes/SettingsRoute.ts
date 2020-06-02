import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

import { RouteConfig, BaseRoute, RoutePrefix } from "./BaseRoute";

var mockSettings = { webhookUrl: "abc", landingPageUrl: "zxc" }

@injectable()
@RoutePrefix("/settings")
export default class SettingsRoute extends BaseRoute {

    constructor() {
        super();
    }

    @RouteConfig("get", "/")
    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(200).json(mockSettings);
    }

    @RouteConfig("post", "/")
    async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        mockSettings = req.body;
        res.status(200).json("OK");
    }
}