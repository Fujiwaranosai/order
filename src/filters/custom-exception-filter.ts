import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LogCommand } from 'log';
import { throwError } from 'rxjs';

import { OrderCommand } from '../order.command';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(@Inject('LOG_SERVICE') private logClient: ClientProxy) {}

  catch(exception: any, host: ArgumentsHost): any {
    if (typeof exception === 'string') {
      this.logClient.emit(LogCommand.Log.Error, {
        channel: OrderCommand.Name,
        content: exception,
      });
    } else {
      this.logClient.emit(LogCommand.Log.Error, {
        channel: OrderCommand.Name,
        content: JSON.stringify(exception),
      });
    }

    if (exception.response && exception.status) {
      return throwError(exception);
    }

    return throwError({
      response: exception,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
