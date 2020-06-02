//# Imports Default
import "reflect-metadata";
import { expect } from 'chai';
import 'mocha';
import { StubbedInstance, stubInterface as StubInterface, } from "ts-sinon";

//# Imports

import Startup from "../../src/Startup"
import { DependencyInjection } from "../../src/DependencyInjection";
import { DependencyContainer, } from "tsyringe";
import { IServer } from "../../src/types";

describe('Startup: Startup', () => {
    let serverStub: StubbedInstance<IServer>;

    let startup: Startup;

    beforeEach(() => {
        serverStub = StubInterface<IServer>();

        startup = new Startup(serverStub);
    })

    describe('install', () => {
        it('should run install command with args parameter and return result', async () => {
         
            var serverStartSpy = serverStub.startServer;
            var serverCreateAppSpy = serverStub.createAppWithRoutes;


            await startup.main();


            expect(serverCreateAppSpy.calledOnce).equals(true);
            expect(serverStartSpy.calledOnce).equals(true);

        });
    });
});