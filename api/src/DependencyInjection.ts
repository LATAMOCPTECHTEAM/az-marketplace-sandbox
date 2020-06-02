import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import logger from "./helpers/Logger";

import HealthcheckRoute from "./routes/HealthcheckRoute";
import SettingsRoute from "./routes/SettingsRoute";

import Server from "./server/Server";
import { ICustomRoute } from "./types";
import Startup from "./Startup";

export class DependencyInjection {

    private container: DependencyContainer;

    constructor() {
        this.container = container;
    }

    setup() {
        // Startup
        container.register("IStartup", { useClass: Startup });

        // Server
        container.register("IServer", { useClass: Server });

        // Helpers
        container.register("Logger", { useValue: logger })

        // Services
      

        // Routes
        container.register("IHeathcheckRoute", { useClass: HealthcheckRoute });
        container.register("ISettingsRoute", { useClass: SettingsRoute });

        // Injecting Routes for Express
        const Routes = [
          "IHeathcheckRoute",
          "ISettingsRoute"
        ];
        var customRoutes = Routes.map(route => Instance.getContainer().resolve<ICustomRoute>(route));
        container.register("CustomRoutes", { useValue: customRoutes })
    }

    getContainer(): DependencyContainer {
        return this.container;
    }
}

const Instance = new DependencyInjection()

export default Instance;