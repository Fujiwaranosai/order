import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { expect } from 'chai';
import { OrderEntity } from 'db';
import { LogCommand } from 'log';
import { SinonSandbox } from 'sinon';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderCommand } from './order.command';

import Chai = require('chai');

import Sinon = require('sinon');
import SinonChai = require('sinon-chai');

Chai.use(SinonChai);

describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;
  let sandbox: SinonSandbox;
  let logClient;

  before(async () => {
    logClient = { emit: () => ({}) };
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getRepositoryToken(OrderEntity),
          useFactory: () => ({
            metadata: {
              columns: [],
              connection: { options: { type: null } },
              relations: {},
            },
          }),
        },
        {
          provide: 'LOG_SERVICE',
          useValue: logClient,
        },
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('orderFromCall should work', () => {
    const createOneBaseStub = sandbox.stub(appController.base, 'createOneBase').resolves();
    const emitStub = sandbox.stub(logClient, 'emit').resolves();
    const request: CrudRequest = { options: {}, parsed: null };
    const payload = { body: new OrderEntity(), request };
    appController.orderFromCall(payload);

    expect(emitStub).to.be.calledWith(LogCommand.Log.Info, {
      channel: OrderCommand.From.Call,
      content: JSON.stringify(payload),
    });

    expect(createOneBaseStub).to.be.calledWith(payload.request, payload.body);
  });
});
