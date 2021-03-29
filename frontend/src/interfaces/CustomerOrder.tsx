import { Item } from './Items';

interface Order {
  orderId: number;
  status: 'completed' | 'confirmed' | 'cancelled';
  totalPrice: number;
  creationDate: string;
  completionDate: string;
  customer: Customer;
  orderedGoods: OrderedGoods[];
}

interface OrderedGoods {
  compositeId: number;
  totalPrice: number;
  quantity: number;
  item: Item;
}

interface Customer {
  customerID: number;
  name: string;
  email: string;
}

export type { Order, OrderedGoods };
