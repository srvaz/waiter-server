import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'orders'
    }
  }
})
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  pass: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  items: OrderRelations[];

  @property({
    type: 'string',
    required: true,
  })
  totalPrice: string;

  @property({
    type: 'boolean',
    required: false,
  })
  finished: boolean;


  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  id: number;
  quantity: number;
}

export type OrderWithRelations = Order & OrderRelations;
