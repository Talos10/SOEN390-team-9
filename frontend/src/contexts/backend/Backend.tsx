import { createContext, useContext } from 'react';
import { inventory, Inventory } from './Inventory';
import { Manufacturing, manufacturing } from './Manufacturing';
import { admin, Admin } from './Admin';
import { sales, Sales } from './Sales';
import { customer, Customers } from './Customers';

interface Backend {
  inventory: Inventory;
  manufacturing: Manufacturing;
  admin: Admin;
  sales: Sales;
  customer: Customers;
}

const BackendContext = createContext<Backend | undefined>(undefined);

interface Props {
  children?: React.ReactNode;
}

export const BackendProvider = ({ children }: Props) => {
  return (
    <BackendContext.Provider value={{ inventory, manufacturing, admin, sales, customer }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => useContext(BackendContext) as Backend;
