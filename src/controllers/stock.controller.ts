import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {OrderRelations, Stock} from '../models';
import {StockRepository} from '../repositories';

export class StockController {
  constructor(
    @repository(StockRepository)
    public stockRepository: StockRepository,
  ) {}

  @post('/stock-list', {
    responses: {
      '200': {
        description: 'Stock model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stock)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {
            title: 'NewStock',
            exclude: ['id'],
          }),
        },
      },
    })
    stock: Omit<Stock, 'id'>,
  ): Promise<Stock> {
    return this.stockRepository.create(stock);
  }

  @get('/stock-list/count', {
    responses: {
      '200': {
        description: 'Stock model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Stock) where?: Where<Stock>,
  ): Promise<Count> {
    return this.stockRepository.count(where);
  }

  @get('/stock-list', {
    responses: {
      '200': {
        description: 'Array of Stock model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Stock, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Stock) filter?: Filter<Stock>,
  ): Promise<Stock[]> {
    return this.stockRepository.find(filter);
  }

  @patch('/stock-list', {
    responses: {
      '200': {
        description: 'Stock PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {partial: true}),
        },
      },
    })
    stock: Stock,
    @param.where(Stock) where?: Where<Stock>,
  ): Promise<Count> {
    return this.stockRepository.updateAll(stock, where);
  }

  @get('/stock-list/{id}', {
    responses: {
      '200': {
        description: 'Stock model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Stock, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Stock, {exclude: 'where'}) filter?: FilterExcludingWhere<Stock>
  ): Promise<Stock> {
    return this.stockRepository.findById(id, filter);
  }

  @patch('/stock-list/{id}', {
    responses: {
      '204': {
        description: 'Stock PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stock, {partial: true}),
        },
      },
    })
    stock: Stock,
  ): Promise<void> {
    await this.stockRepository.updateById(id, stock);
  }

  async decrementStock(items: Array<OrderRelations>): Promise<void> {
    const operations: Promise<void>[] = [];

    for (const item of items) {
      const decrementation = item.quantity;
      const stockQuantity = (await this.findById(item.id)).quantity;

      if (stockQuantity >= decrementation) {
        const quantity = stockQuantity - decrementation;
        operations.push(this.stockRepository.updateById(item.id, {quantity}));
      } else {
        return Promise.reject('Decrementation is greater then quantity in stock!');
      }
    }

    await Promise.all(operations);
  }

  @put('/stock-list/{id}', {
    responses: {
      '204': {
        description: 'Stock PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() stock: Stock,
  ): Promise<void> {
    await this.stockRepository.replaceById(id, stock);
  }

  @del('/stock-list/{id}', {
    responses: {
      '204': {
        description: 'Stock DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.stockRepository.deleteById(id);
  }
}
