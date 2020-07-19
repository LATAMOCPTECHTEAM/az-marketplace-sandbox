import { Router, Request, Response, NextFunction, Application } from "express";
import { IOperation, ISubscription, ISettings } from "./models";

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
    createSubscription(subscription: ISubscription): Promise<void>;
    updateSubscription(subscription: ISubscription): Promise<void>;
    getSubscription(id: string): Promise<ISubscription>;
    listSubscription(): Promise<ISubscription[]>;
    listSubscriptionPaged(skip: number): Promise<{ subscriptions: ISubscription[], nextSkip: number }>;
    deleteSubscription(id: string): void;
}

export interface IOperationService {
    delete(operationId: string);
    sendWebhook(operationId: string);
    confirmChangePlan(operationId: string, subscriptionId: string, planId: string, quantity: string, status: string);
    changePlan(subscriptionId: string, planId: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }>;
    changeQuantity(subscriptionId: string, quantity: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }>;
    simulateSuspend(operation: IOperation): Promise<boolean>;
    simulateUnsubscribe(operation: IOperation): Promise<boolean>;
    simulateReinstate(operation: IOperation): Promise<boolean>;
    list(subscriptionId: string): Promise<IOperation[]>;
    get(subscriptionId: string, operationId: string): Promise<IOperation>;
}

// Repositories
export interface ISubscriptionRepository {
    create(subscription: ISubscription);
    getById(id: string): Promise<ISubscription>;
    updateOne(id: string, subscription: ISubscription);
    deleteById(id: string);
    listByCreationDateDescending(): Promise<ISubscription[]>;
    listPaged(skip: number, take: number, order: string): Promise<{ subscriptions: ISubscription[]; nextSkip: number; }>;
}

export interface ISettingsRepository {
    createOrUpdate(settings: ISettings);
    get(): Promise<ISettings>;
}

export interface IOperationRepository {
    getById(id: string): Promise<IOperation>;
    getBySubscriptionAndId(subscriptionId: string, operationId: string): Promise<IOperation>;
    delete(operationId: string): Promise<void>;
    listBySubscriptionDescendingByTimestamp(subscriptionId: string): Promise<IOperation[]>;
    create(operation: IOperation): Promise<void>;
    updateOne(id: string, operation: IOperation): Promise<void>;
}
// Startup
export interface IStartup {
    main(): Promise<void>;
}