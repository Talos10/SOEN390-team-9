import { Item } from '../../interfaces/Items';

export interface Inventory {
  getAllGoods: () => Promise<Item[]>;
  addGood: (good: FinishedGoodData | SemiFinishedGoodData | RawMaterialData) => Promise<Response>;
  getGood: (id: string | number) => Promise<{ schema: Item }>;
  archiveGood: (id: number | string) => Promise<Response[]>;
  getFinishedGoods: () => Promise<Item[]>;
}

interface Response {
  status: true;
  message: string;
}

interface Good {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  type: 'raw' | 'semi-finished' | 'finished';
  vendor: string;
  processTime: number;
  properties: Property[];
  components: Component[];
  price: number;
}

interface Component {
  id: number;
  name: string;
  quantity: number;
}

interface Property {
  name: string;
  value: string;
}

interface FinishedGoodData {
  name?: string;
  type?: 'finished';
  cost?: number;
  price?: number;
  components?: Component[];
  processTime?: number;
  properties?: Property[];
}

interface SemiFinishedGoodData {
  name?: string;
  type?: 'semi-finished';
  components?: Component[];
  processTime?: number;
  properties?: Property[];
  cost?: number;
}

interface RawMaterialData {
  name?: string;
  type?: 'raw';
  cost?: number;
  vendor?: string;
  processTime?: number;
  properties?: Property[];
}

export const inventory = (client: string): Inventory => {
  const getAllGoods = async () => {
    const request = await fetch(`${client}/good/`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    return response.message as Good[];
  };

  const addGood = async (good: FinishedGoodData | SemiFinishedGoodData | RawMaterialData) => {
    const request = await fetch(`${client}/good/single`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(good)
    });

    const response = await request.json();
    return response;
  };

  const getGood = async (id: number | string) => {
    const request = await fetch(`${client}/good/id/${id}`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    return response.message as { schema: Good };
  };

  const archiveGood = async (id: number | string) => {
    const request = await fetch(`${client}/good/archive`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ id: Number(id), archive: true }])
    });

    const responses = (await request.json()) as Response[];
    return responses;
  };

  const getFinishedGoods = async () => {
    const request = await fetch(`${client}/good/type/finished`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    return response.message as Item[];
  };

  return { getAllGoods, getGood, addGood, archiveGood, getFinishedGoods };
};
