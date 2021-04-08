interface Item {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  price: number;
  components: Component[];
  properties: Property[];
  type: string;
  vendor: string;
  processTime: number;
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
