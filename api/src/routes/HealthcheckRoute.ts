import { injectable } from "tsyringe";
import { Request, Response } from "express";

import { IHealthcheck } from "@types";
import { BaseRoute, RouteConfig, RoutePrefix } from "./BaseRoute";

@injectable()
@RoutePrefix("/api/health")
export default class HealthcheckRoute extends BaseRoute implements IHealthcheck {

    /**
    * GET /api/health 
    * @swagger
    * /api/health:
    *   get:
    *     tags:
    *     - "healthcheck"
    *     summary: "Check if the web server is running properly"
    *     description: "Check if the web server is running properly"
    *     produces:
    *     - "application/json"
    *     consumes:
    *     - "application/json"
    *     responses:
    *       "200":
    *         description: "Ok"
    *       "500":
    *         description: "Internal Server Error"
    */
    @RouteConfig("get", "/")
    async health(req: Request, res: Response): Promise<void> {
        res.status(200).json("OK");
    }
}