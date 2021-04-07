export interface Machine {
  machineId: number;
  numberOrderCompleted: number;
  status: string;
}

export interface Response {
  status: true;
  message: string;
}

export interface Machines {
  getAllMachines: () => Promise<Machine[]>;
  addMachine: (machine: { status: string; numberOrderCompleted: number }) => Promise<Machine>;
}

export const machine = (client: string, validateResponse: (response: any) => void): Machines => {
  const getAllMachines = async () => {
    const request = await fetch(`${client}/machine`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = (await request.json()) as Machine[];
    return response;
  };

  const addMachine = async (machine: { status: string; numberOrderCompleted: number }) => {
    const request = await fetch(`${client}/machine`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(machine)
    });
    validateResponse(request);
    const response = (await request.json()) as Machine;
    return response;
  };

  return { getAllMachines, addMachine };
};
