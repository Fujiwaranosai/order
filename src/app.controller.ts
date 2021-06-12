import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Crud, CrudController, CrudRequest } from '@nestjsx/crud';
import { OrderEntity } from 'db';
import { LogCommand } from 'log';

import { AppService } from './app.service';
import { OrderCommand } from './order.command';

@Crud({
  model: {
    type: OrderEntity,
  },
})
@Controller()
export class AppController implements CrudController<OrderEntity> {
  constructor(public service: AppService, @Inject('LOG_SERVICE') private logClient: ClientProxy) {}

  get base(): CrudController<OrderEntity> {
    return this;
  }

  @MessagePattern(OrderCommand.From.Call)
  orderFromCall(@Payload() payload: { request: CrudRequest; body: OrderEntity }) {
    this.logClient.emit(LogCommand.Log.Info, {
      channel: OrderCommand.From.Call,
      content: JSON.stringify(payload),
    });

    return this.base.createOneBase(payload.request, payload.body);
  }
}
