import { createContext, useContext } from 'react';
import { inventory, Inventory } from './Inventory';
import { Manufacturing, manufacturing } from './Manufacturing';
import { admin, Admin } from './Admin';
import { planning, Planning } from './Planning';
import { sales, Sales } from './Sales';
import { customer, Customers } from './Customers';
import { accounting, Accounting } from './Accounting';
import { useAuth } from '../Auth';

interface Backend {
  inventory: Inventory;
  manufacturing: Manufacturing;
  admin: Admin;
  planning: Planning;
  sales: Sales;
  customer: Customers;
  accounting: Accounting
}

const BackendContext = createContext<Backend | undefined>(undefined);

interface Props {
  client: string;
  children?: React.ReactNode;
}

export const BackendProvider = ({ client, children }: Props) => {
  const auth = useAuth();

  const validateResponse = (response: Response) => {
    if (response.ok) return;
    switch (response.status) {
      case 401:
        auth.logOut();
        return;
    }
  };

  const backend = {
    admin: admin(client, validateResponse),
    inventory: inventory(client, validateResponse),
    manufacturing: manufacturing(client, validateResponse),
    planning: planning(client, validateResponse),
    sales: sales(client, validateResponse),
    customer: customer(client, validateResponse),
    accounting: accounting(client, validateResponse)
  };

  return <BackendContext.Provider value={backend}>{children}</BackendContext.Provider>;
};

export const useBackend = () => useContext(BackendContext) as Backend;
