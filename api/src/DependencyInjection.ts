import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";

import { ICustomRoute } from "@types";
import logger from "@helpers/Logger";
import Server from "@server/Server";
import Startup from "./Startup";
import { HealthcheckRoute, MarketplaceRoute, OperationRoute, SettingsRoute, SubscriptionRoute } from "@routes";
import { OperationRepository, SettingsRepository, SubscriptionRepository } from "@repositories";
import { OperationSchema, SettingsSchema, SubscriptionSchema } from "@schemas";
import { OperationService, SettingsService, SubscriptionService } from "@services";

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
        container.register("IOperationService", { useClass: OperationService })

        // Routes
        container.register("IHeathcheckRoute", { useClass: HealthcheckRoute });
        container.register("ISettingsRoute", { useClass: SettingsRoute });
        container.register("ISubscriptionRoute", { useClass: SubscriptionRoute });
        container.register("IMarketplaceRoute", { useClass: MarketplaceRoute });
        container.register("IOperationRoute", { useClass: OperationRoute });

        // Schemas
        container.register("SubscriptionSchema", { useValue: SubscriptionSchema });
        container.register("SettingsSchema", { useValue: SettingsSchema });
        container.register("OperationSchema", { useValue: OperationSchema });

        // Repositories
        container.register("ISubscriptionRepository", { useClass: SubscriptionRepository });
        container.register("ISettingsRepository", { useClass: SettingsRepository });
        container.register("IOperationRepository", { useClass: OperationRepository });

        // Injecting Routes for Express
        const Routes = [
            "IHeathcheckRoute",
            "ISettingsRoute",
            "ISubscriptionRoute",
            "IMarketplaceRoute",
            "IOperationRoute"
        ];
        // eslint-disable-next-line no-use-before-define
        const customRoutes = Routes.map(route => Instance.getContainer().resolve<ICustomRoute>(route));
        container.register("CustomRoutes", { useValue: customRoutes })
    }

    getContainer(): DependencyContainer {
        return this.container;
    }
}
const Instance = new DependencyInjection()

export default Instance;