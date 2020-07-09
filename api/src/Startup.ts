const dotenv = require("dotenv");
import { injectable, inject } from "tsyringe";

import { IServer } from "./types";


@injectable()
export default class Startup {
    constructor(
        @inject("IServer") private server: IServer) {

    }

    async main(): Promise<void> {
        console.log(`Starting process using NODE_ENV: ${process.env.NODE_ENV}`);
        if (process.env.NODE_ENV == "development") {
            dotenv.config();
        }

        this.server.createAppWithRoutes();
        this.server.startServer();
    }
}