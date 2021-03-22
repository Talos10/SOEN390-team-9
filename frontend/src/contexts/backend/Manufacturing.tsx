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

export interface Manufacturing {
  getAllOrders: () => Promise<Orders[]>;
  getOrder: (id: string | number) => Promise<Orders>;
  createOrder: (orders: [{ compositeId: number; quantity: number }]) => Promise<Response>;
  updateStatus: (
    status: 'confirmed' | 'cancelled' | 'processing' | 'completed',
    orders: [id: number]
  ) => Promise<Response[]>;
}
export const manufacturing = (client: string): Manufacturing => {
  const getAllOrders = async () => {
    const request = await fetch(`${client}/manufacturing/order`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    return response.message as Orders[];
  };

  const getOrder = async (id: number | string) => {
    const request = await fetch(`${client}/manufacturing/order/id/${id}`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    return ((await request.json()) as any).message as Orders;
  };

  const createOrder = async (orders: [{ compositeId: number; quantity: number }]) => {
    const request = await fetch(`${client}/manufacturing/order/`, {
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
    const request = await fetch(`${client}/manufacturing/order/${status}`, {
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

  return { getAllOrders, getOrder, createOrder, updateStatus };
};
