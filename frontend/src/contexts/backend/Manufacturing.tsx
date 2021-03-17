import { Orders } from '../../interfaces/Orders';
import { api } from '../../utils/api';

interface Response {
  status: boolean;
  message: string;
}

export interface Manufacturing {
  getAllOrders: () => Promise<Orders[]>;
  getOrder: (id: string | number) => Promise<Orders>;
  createOrder: (orders: [{ compositeId: number; quantity: number }]) => Promise<Response>;
  updateStatus: (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => Promise<Response[]>;
}

const getAllOrders = async () => {
  const request = await fetch(`${api}/manufacturing/order`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const response = await request.json();
  return response.message as Orders[];
};

const getOrder = async (id: number | string) => {
  const request = await fetch(`${api}/manufacturing/order/id/${id}`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  return ((await request.json()) as any).message as Orders;
};

const createOrder = async (orders: [{ compositeId: number; quantity: number }]) => {
  const request = await fetch(`${api}/manufacturing/order/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.token}`
    },
    body: JSON.stringify(orders)
  });

  const response: Response = await request.json();
  return response;
};

const updateStatus = async (
  status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
  orders: [id: number]
) => {
  const request = await fetch(`${api}/manufacturing/order/${status}`, {
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

export const manufacturing: Manufacturing = { getAllOrders, getOrder, createOrder, updateStatus };
