interface Orders {
  orderId: number;
  status: 'processing' | 'completed' | 'confirmed';
  cost: number;
  creationDate: string;
  startDate: string;
  estimatedEndDate: string;
  completionDate: string;
  orderedGoods: OrderedGoods[];
}

interface OrderedGoods {
  id: number;
  cost: number;
  quantity: number;
}

export type { Orders };
