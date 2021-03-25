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

export const customer = (client: string, validateResponse: (response: any) => void): Customers => {
  const getAllCustomers = async () => {
    const request = await fetch(`${client}/customer`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = (await request.json()) as CustomerResponse[];
    return response;
  };

  const addCustomer = async (customer: { name: string; email: string }) => {
    const request = await fetch(`${client}/customer`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });
    validateResponse(request);
    const response = (await request.json()) as CustomerResponse;
    return response;
  };

  return { getAllCustomers, addCustomer };
};
