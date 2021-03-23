import { Order } from '../../interfaces/CustomerOrder';
import { api } from '../../utils/api';
import { inventory } from './Inventory';

interface Response {
  status: boolean;
  message: string;
}

interface Good {
  compositeId: number;
  quantity: number;
}

export interface Sales {
  getAllOrders: () => Promise<Order[]>;
  getOrder: (id: string | number) => Promise<Order>;
  createOrder: (customerId: number, orders: Good[]) => Promise<Response>;
  updateStatus: (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => Promise<Response[]>;
}

const getAllOrders = async () => {
  const request = await fetch(`${api}/order`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const response = await request.json();
  return response.message as Order[];
};

const getOrder = async (id: number | string) => {
  const request = await fetch(`${api}/order/id/${id}`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const order = ((await request.json()) as any).message as Order;
  const goods = await Promise.all(
    order.orderedGoods.map(async good => ({
      ...good,
      item: (await inventory.getGood(good.compositeId)).schema
    }))
  );
  order.orderedGoods = goods;
  return order;
};

const createOrder = async (customerId: number, orders: Good[]) => {
  const request = await fetch(`${api}/order/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.token}`
    },
    body: JSON.stringify({ customerId: customerId, orderedGoods: orders })
  });

  const response: Response = await request.json();
  return response;
};

const updateStatus = async (
  status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
  orders: [id: number]
) => {
  const request = await fetch(`${api}/order/${status}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.token}`
    },
    body: JSON.stringify(orders)
  });

  const responses: Response[] = await request.json();
  return responses;
};

export const sales: Sales = { getAllOrders, getOrder, createOrder, updateStatus };
