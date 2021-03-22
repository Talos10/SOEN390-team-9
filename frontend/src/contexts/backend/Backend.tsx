import { createContext, useContext } from 'react';
import { inventory, Inventory } from './Inventory';
import { Manufacturing, manufacturing } from './Manufacturing';
import { admin, Admin } from './Admin';
import { planning, Planning } from './Planning';

interface Backend {
  inventory: Inventory;
  manufacturing: Manufacturing;
  admin: Admin;
  planning: Planning;
}

const BackendContext = createContext<Backend | undefined>(undefined);

interface Props {
  client: string;
  children?: React.ReactNode;
}

export const BackendProvider = ({ client, children }: Props) => {
  const backend = {
    admin: admin(client),
    inventory: inventory(client),
    manufacturing: manufacturing(client),
    planning: planning(client)
  };

  return <BackendContext.Provider value={backend}>{children}</BackendContext.Provider>;
};

export const useBackend = () => useContext(BackendContext) as Backend;
