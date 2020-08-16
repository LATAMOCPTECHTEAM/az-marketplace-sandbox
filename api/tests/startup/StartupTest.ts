// Imports Default
import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { StubbedInstance, stubInterface } from "ts-sinon";

// Imports
import { IServer } from "@types";
import Startup from "@Startup"

describe('Startup: Startup', () => {
    let serverStub: StubbedInstance<IServer>;

    let startup: Startup;

    beforeEach(() => {
        serverStub = stubInterface<IServer>();

        startup = new Startup(serverStub);
    })

    describe('install', () => {
        it('should run install command with args parameter and return result', async () => {

            const serverStartSpy = serverStub.startServer;
            const serverCreateAppSpy = serverStub.createAppWithRoutes;

            await startup.main();

            expect(serverCreateAppSpy.calledOnce).equals(true);
            expect(serverStartSpy.calledOnce).equals(true);

        });
    });
});