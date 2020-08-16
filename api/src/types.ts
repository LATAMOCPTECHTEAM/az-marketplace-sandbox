import { Application, NextFunction, Request, Response, Router } from "express";

import { IOperation, ISettings, ISubscription } from "@models";

// # Routes
export interface IHealthcheck extends ICustomRoute {
    health(req: Request, res: Response, next: NextFunction): void;
}

export interface IRoute {
    handler: (req: Request, res: Response, next: NextFunction) => any,
    method: string;
    route: string;
}

export interface ICustomRoute {
    configureRouter(app: Application): Router,
    routes: IRoute[];
}

// Server
export interface IServer {
    createApp(routes: ICustomRoute[]): Application;
    createAppWithRoutes(): Application;
    startServer(): void;
}


// Services
export interface ISettingsService {
    getSettings(): Promise<ISettings>;
    updateSettings(settings: ISettings): void;
}

export interface ISubscriptionService {
    activateSubscription(id: string, planId: string, quantity: string): void;
    createSubscription(subscription: ISubscription): Promise<void>;
    deleteSubscription(id: string): void;
    getSubscription(id: string): Promise<ISubscription>;
    listSubscription(): Promise<ISubscription[]>;
    listSubscriptionPaged(skip: number): Promise<{ nextSkip: number, subscriptions: ISubscription[] }>;
    updateSubscription(subscription: ISubscription): Promise<void>;
}

export interface IOperationService {
    changePlan(subscriptionId: string, planId: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }>;
    changeQuantity(subscriptionId: string, quantity: string, id?: string, activityId?: string, timeStamp?: string): Promise<{ id: string, webhookSent: boolean }>;
    confirmChangePlan(operationId: string, subscriptionId: string, planId: string, quantity: string, status: string): Promise<void>;
    delete(operationId: string);
    get(subscriptionId: string, operationId: string): Promise<IOperation>;
    list(subscriptionId: string): Promise<IOperation[]>;
    sendWebhook(operationId: string);
    simulateReinstate(operation: IOperation): Promise<boolean>;
    simulateSuspend(operation: IOperation): Promise<boolean>;
    simulateUnsubscribe(operation: IOperation): Promise<boolean>;
}

// Repositories
export interface ISubscriptionRepository {
    create(subscription: ISubscription);
    deleteById(id: string);
    getById(id: string): Promise<ISubscription>;
    listByCreationDateDescending(): Promise<ISubscription[]>;
    listPaged(skip: number, take: number, order: string): Promise<{ nextSkip: number; subscriptions: ISubscription[]; }>;
    updateOne(id: string, subscription: ISubscription);
}

export interface ISettingsRepository {
    createOrUpdate(settings: ISettings);
    get(): Promise<ISettings>;
}

export interface IOperationRepository {
    create(operation: IOperation): Promise<void>;
    delete(operationId: string): Promise<void>;
    getById(id: string): Promise<IOperation>;
    getBySubscriptionAndId(subscriptionId: string, operationId: string): Promise<IOperation>;
    listBySubscriptionDescendingByTimestamp(subscriptionId: string): Promise<IOperation[]>;
    updateOne(id: string, operation: IOperation): Promise<void>;
}
// Startup
export interface IStartup {
    main(): Promise<void>;
}