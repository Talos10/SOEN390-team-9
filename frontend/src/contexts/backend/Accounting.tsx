interface Client {
  customerId: number;
  name: string;
  email: string;
  totalSpent: number;
  numOrders: number;
}

export interface Accounting {
  //income
  getIncome: () => Promise<number>;
  getIncomePerMonth: () => Promise<number[]>;
  //expense
  getExpense: () => Promise<number>;
  getExpensePerMonth: () => Promise<number[]>;
  //top 3 customers
  getTop3Customers: () => Promise<Client[]>;
}

export const accounting = (
  client: string,
  validateResponse: (response: any) => void
): Accounting => {
  const getIncome = async () => {
    const request = await fetch(`${client}/order/income`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = await request.json();
    const income = response.message as number;
    return income;
  };

  const getIncomePerMonth = async () => {
    const request = await fetch(`${client}/order/income/month`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = await request.json();
    const monthlyIncome = response.message as number[];
    return monthlyIncome;
  };

  const getExpense = async () => {
    const request = await fetch(`${client}/manufacturing/expense`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = await request.json();
    const expense = response.message as number;
    return expense;
  };

  const getExpensePerMonth = async () => {
    const request = await fetch(`${client}/manufacturing/expense/month`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = await request.json();
    const monthlyExpense = response.message as number[];
    return monthlyExpense;
  };

  const getTop3Customers = async () => {
    const request = await fetch(`${client}/customer/top3`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const topClients = (await request.json()) as Client[];
    return topClients;
  };

  return {
    getIncome,
    getIncomePerMonth,
    getExpense,
    getExpensePerMonth,
    getTop3Customers
  };
};
