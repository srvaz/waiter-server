import {DefaultCrudRepository} from '@loopback/repository';
import {Stock, StockRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StockRepository extends DefaultCrudRepository<
  Stock,
  typeof Stock.prototype.id,
  StockRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Stock, dataSource);
  }
}
