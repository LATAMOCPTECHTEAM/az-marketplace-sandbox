import { Router, Request, Response, NextFunction, Application } from "express";


// # Routes

export interface IHealthcheck extends ICustomRoute{

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

// Startup

export interface IStartup {

    main(): Promise<void>;

}