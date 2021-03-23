import { api } from '../../utils/api';

export interface Customer {
  name: string;
  email: string;
}

export interface CustomerResponse {
  customerId: number;
  name: string;
  email: string;
}

export interface Customers {
  getAllCustomers: () => Promise<CustomerResponse[]>;
  addCustomer: (customer: { name: string; email: string }) => Promise<CustomerResponse>;
}

const getAllCustomers = async () => {
  const request = await fetch(`${api}/customer`, {
    method: 'GET',
    headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
  });
  const response = (await request.json()) as CustomerResponse[];
  return response;
};

const addCustomer = async (customer: { name: string; email: string }) => {
  const request = await fetch(`${api}/customer`, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${localStorage.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
  });
  const response = (await request.json()) as CustomerResponse;
  return response;
};

export const customer: Customers = { getAllCustomers, addCustomer };
