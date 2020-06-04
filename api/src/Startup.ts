const dotenv = require("dotenv");
import { injectable, inject } from "tsyringe";

import { IServer } from "./types";

// TODO Change to dependency injection
import mongoose from "mongoose";
import SettingsSchema from "./models/SettingsSchema";

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

        await mongoose.connect("mongodb://mongo:27017/sandbox", { useFindAndModify: false })

        this.server.createAppWithRoutes();
        this.server.startServer();
    }
}