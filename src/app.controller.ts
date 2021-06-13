import { BadRequestException, Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
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
  async orderFromCall(@Payload() payload: { request: CrudRequest; body: OrderEntity }) {
    this.logClient.emit(LogCommand.Log.Info, {
      channel: OrderCommand.From.Call,
      content: JSON.stringify(payload),
    });

    try {
      return await this.base.createOneBase(payload.request, payload.body);
    } catch (ignore) {
      throw new BadRequestException('Cannot create order');
    }
  }
}
