import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import logger from "./helpers/Logger";

import HealthcheckRoute from "./routes/HealthcheckRoute";
import SettingsRoute from "./routes/SettingsRoute";
import SubscriptionRoute from "./routes/SubscriptionRoute";
import MarketplaceRoute from "./routes/MarketplaceRoute";

import Server from "./server/Server";
import { ICustomRoute } from "./types";
import Startup from "./Startup";
import SettingsService from "./services/SettingsService";
import SubscriptionService from "./services/SubscriptionService";


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
        container.register("ISettingsService", { useClass: SettingsService })
        container.register("ISubscriptionService", { useClass: SubscriptionService })


        // Routes
        container.register("IHeathcheckRoute", { useClass: HealthcheckRoute });
        container.register("ISettingsRoute", { useClass: SettingsRoute });
        container.register("ISubscriptionRoute", { useClass: SubscriptionRoute });
        container.register("IMarketplaceRoute", { useClass: MarketplaceRoute });

        // Injecting Routes for Express
        const Routes = [
            "IHeathcheckRoute",
            "ISettingsRoute",
            "ISubscriptionRoute",
            "IMarketplaceRoute"
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