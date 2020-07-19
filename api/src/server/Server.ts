import { Application } from 'express';
import express from 'express';
import http from 'http';
import { injectable, inject } from "tsyringe";
import { Logger } from 'winston';
import { Address } from 'cluster';

import DefaultHandler from './handlers/DefaultHandlers';
import AuthenticationHandler from './handlers/AuthenticationHandler';
import ErrorHandler from './handlers/ErrorHandler';
import NotFoundHandler from './handlers/NotFoundHandler';
import SwaggerHandler from './handlers/SwaggerHandler';
var path = require('path');

import { ICustomRoute, IServer } from '../types';

@injectable()
export default class Server implements IServer {

    private app: Application;
    private authentication: boolean;
    constructor(@inject("CustomRoutes") private customRoutes: ICustomRoute[], @inject("Logger") private logger: Logger) {
        this.authentication = !!process.env.authenticationKey;
    }

    startServer(): void {
        const Server: http.Server = http.createServer(this.app);
        Server.listen(this.app.get('port'));
        Server.on('error', (error: Error) => onError(error, this.app.get('port')));
        Server.on('listening', onListening.bind(Server));
    }

    createAppWithRoutes(): Application {
        var routeHandlers = this.customRoutes;
        return this.createApp(routeHandlers);
    }

    createApp(routes: ICustomRoute[]): Application {
        this.app = express();

        DefaultHandler(this.app);

        if (this.authentication) {
            AuthenticationHandler(this.app);
        }

        if (routes && routes.length > 0) {
            for (var route of routes) {
                route.configureRouter(this.app);
            }
        }

        SwaggerHandler(this.app, this.logger);


        this.app.use('/assets', express.static(path.resolve(__dirname + '/../assets')));
        this.app.use('/static', express.static(path.resolve(__dirname + '/../public/static')));
        this.app.use(/^\/(?!api).*/, (req, res) => {
            res.sendFile(path.resolve(__dirname + '/../public/index.html'));
        })

        ErrorHandler(this.app);

        NotFoundHandler(this.app);

        // App Settings
        this.app.set('port', process.env.PORT || 80);

        return this.app;
    }


}

function onListening() {
    const addr: Address = this.address();
    const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;

    console.log(`Listening on ${bind}`);
}

function onError(error: NodeJS.ErrnoException, port: number | string | boolean): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            break;
    }
    process.exit(1);
}