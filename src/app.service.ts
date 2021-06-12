import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrderEntity } from 'db';

@Injectable()
export class AppService extends TypeOrmCrudService<OrderEntity> {
  constructor(@InjectRepository(OrderEntity) repo) {
    super(repo);
  }
}
