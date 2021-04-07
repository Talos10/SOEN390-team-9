import { Item } from './Items';

interface Order {
  orderId: number;
  status: 'processing' | 'completed' | 'confirmed';
  cost: number;
  creationDate: string;
  startDate: string;
  estimatedEndDate: string;
  completionDate: string;
  orderedGoods: ItemInfo[];
}

interface ItemInfo {
  compositeId: number;
  item: Item;
  cost: number;
  quantity: number;
}

export type { Order, ItemInfo };
