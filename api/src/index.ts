import "reflect-metadata";
import config from "./Config";
import { default as DIContainer } from "./DependencyInjection";
import { IStartup } from "./types";
import mongoose from "mongoose";

mongoose.connect(config.mongo, { useFindAndModify: false })
    .then(x => {
        DIContainer.setup();
        var startup = DIContainer.getContainer().resolve<IStartup>("IStartup")

        return startup.main();
    })
    .then(() => {
        console.log("Process started successfully.")
    })
    .catch(error => {
        console.error("Process exited with an error.")
        console.error(error);
    });