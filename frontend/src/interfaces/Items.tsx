interface Item {
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

export type { Item };
