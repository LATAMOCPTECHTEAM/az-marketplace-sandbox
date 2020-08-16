/* eslint-disable func-names */
import { Router } from "express";
import { ICustomRoute, IRoute } from "@types";

export function RouteConfig(method: string, path: string) {
    return function(target: ICustomRoute, propertyKey: string) {
        if (!target.routes)
            target.routes = [];
        const newRoute: IRoute = {
            route: path,
            method: method,
            handler: target[propertyKey]
        }
        target.routes.push(newRoute);
    }
}

export function RoutePrefix(prefix: string) {
    return function log(target: any) {
        target.prototype.prefix = prefix;
        return target;
    }
}

export class BaseRoute implements ICustomRoute {
    routes: IRoute[];
    prefix: string;
    configureRouter(app: any) {
        // eslint-disable-next-line new-cap
        const router = Router();

        for (const route of this.routes) {
            router[route.method](route.route, route.handler.bind(this));
        }

        app.use(this.prefix, router);
        return router;
    }
}