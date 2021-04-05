import { inventory } from './Inventory';
import { Order } from '../../interfaces/Order'
import { ContactSupportOutlined } from '@material-ui/icons';

interface Response {
  status: boolean;
  message: string;
}

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

interface Good{
  compositeId: number;
  quantity: number;
}

export interface Manufacturing {
  getAllOrders: () => Promise<Orders[]>;
  getOrder: (id: string | number) => Promise<Order>;
  createOrder: (orders: Good[]) => Promise<Response>;
  updateStatus: (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => Promise<Response[]>;
}
export const manufacturing = (
  client: string,
  validateResponse: (response: any) => void
): Manufacturing => {
  const getAllOrders = async () => {
    const request = await fetch(`${client}/manufacturing/order`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    validateResponse(request);
    const response = await request.json();
    return response.message as Orders[];
  };

  const getOrder = async (id: number | string) => {
    const request = await fetch(`${client}/manufacturing/order/id/${id}`, {
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

  const createOrder = async (orders: Good[]) => {
    const request = await fetch(`${client}/manufacturing/order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${localStorage.token}`
      },
      body: JSON.stringify(orders)
    });
    validateResponse(request);
    const response: Response = await request.json();
    return response;
  };

  const updateStatus = async (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => {
    const request = await fetch(`${client}/manufacturing/order/${status}`, {
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
