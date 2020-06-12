import { Router, Request, Response, NextFunction, Application } from "express";
import { ISettings } from "./models/SettingsSchema";
import { ISubscription } from "./models/SubscriptionSchema";
import { IOperation } from "./models/OperationSchema";


// # Routes

export interface IHealthcheck extends ICustomRoute {

    health(req: Request, res: Response, next: NextFunction): void;

}

export interface IRoute {
    route: string;
    method: string;
    handler: (req: Request, res: Response, next: NextFunction) => any
}

export interface ICustomRoute {

    routes: IRoute[];
    configureRouter(app: Application): Router

}

// Server
export interface IServer {
    startServer(): void;
    createApp(routes: ICustomRoute[]): Application;
    createAppWithRoutes(): Application;
}


// Services
export interface ISettingsService {
    updateSettings(settings: ISettings): void;
    getSettings(): Promise<ISettings>;
}

export interface ISubscriptionService {
    activateSubscription(id: string, planId: string, quantity: string): void;
    createSubscription(settings: ISubscription): void;
    updateSubscription(settings: ISubscription): void;
    getSubscription(id: string): Promise<ISubscription>;
    listSubscription(): Promise<ISubscription[]>;
    listSubscriptionPaged(skip: number): Promise<{ subscriptions: ISubscription[], nextSkip: number }>;
    deleteSubscription(id: string): void;
}

export interface IOperationService {
    delete(operationId: string);
    sendWebhook(operationId: string);
    confirmChangePlan(operationId: string, subscriptionId: string, planId: string, quantity: string, status: string);
    simulateSuspend(operation: IOperation);
    simulateChangePlan(operation: IOperation);
    simulateUnsubscribe(operation: IOperation);
    simulateReinstate(operation: IOperation);
    list(subscriptionId: string): Promise<IOperation[]>;
}

// Startup
export interface IStartup {

    main(): Promise<void>;

}