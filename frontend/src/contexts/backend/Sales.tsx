import { Order } from '../../interfaces/CustomerOrder';
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

export const sales = (client: string, validateResponse: (response: any) => void) => {
  const getAllOrders = async () => {
    const request = await fetch(`${client}/order`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    validateResponse(request);
    const response = await request.json();
    return response.message as Order[];
  };

  const getOrder = async (id: number | string) => {
    const request = await fetch(`${client}/order/id/${id}`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    validateResponse(request);
    const order = ((await request.json()) as any).message as Order;
    const goods = await Promise.all(
      order.orderedGoods.map(async good => ({
        ...good,
        item: (await inventory(client, validateResponse).getGood(good.compositeId)).schema
      }))
    );
    order.orderedGoods = goods;
    return order;
  };

  const createOrder = async (customerId: number, orders: Good[]) => {
    const request = await fetch(`${client}/order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${localStorage.token}`
      },
      body: JSON.stringify({ customerId: customerId, orderedGoods: orders })
    });
    validateResponse(request);
    const response: Response = await request.json();
    return response;
  };

  const updateStatus = async (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => {
    const request = await fetch(`${client}/order/${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${localStorage.token}`
      },
      body: JSON.stringify(orders)
    });
    validateResponse(request);
    const responses: Response[] = await request.json();
    return responses;
  };

  return { getAllOrders, getOrder, createOrder, updateStatus };
};
