import { Item } from '../../interfaces/Items';
import { api } from '../../utils/api';

export interface Inventory {
  getAllGoods: () => Promise<Item[]>;
  getGood: (id: string | number) => Promise<{ schema: Item }>;
  archiveGood: (id: number | string) => Promise<Response[]>;
  getFinishedGoods: () => Promise<Item[]>;
}

interface Response {
  status: true;
  message: string;
}

const getAllGoods = async () => {
  const request = await fetch(`${api}/good/`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const response = await request.json();
  return response.message as Item[];
};

const getGood = async (id: number | string) => {
  const request = await fetch(`${api}/good/id/${id}`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const response = await request.json();
  return response.message as { schema: Item };
};

const archiveGood = async (id: number | string) => {
  const request = await fetch(`${api}/good/archive`, {
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
  const request = await fetch(`${api}/good/type/finished`, {
    headers: { Authorization: `bearer ${localStorage.token}` }
  });
  const response = await request.json();
  return response.message as Item[];
};

export const inventory: Inventory = { getAllGoods, getGood, archiveGood, getFinishedGoods };
