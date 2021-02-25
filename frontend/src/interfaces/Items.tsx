export interface Item {
  cost: number;
  id: number;
  name: string;
  quantity: number;
  type: 'raw' | 'semi-finished' | 'finished';
  vendor: string;
}
