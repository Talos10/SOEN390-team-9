import { Item } from './Items';

interface Order {
  orderId: number;
  status: 'processing' | 'completed' | 'confirmed';
  cost: number;
  totalCost: number;
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
  totalCost: number;
}

export type { Order, ItemInfo };
