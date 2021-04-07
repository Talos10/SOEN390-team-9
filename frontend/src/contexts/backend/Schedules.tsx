export interface Schedule {
  machineId: number;
  orderId: number;
  finishTime: string;
  status: string;
}

export interface Response {
  status: true;
  message: string;
}

export interface Schedules {
  getAllSchedules: () => Promise<Schedule[]>;
  scheduleMachine: (schedule: { machineId: number; orderId: number }) => Promise<Response>;
  freeMachine: (schedule: { machineId: number; orderId: number }) => Promise<Response>;
}

export const schedule = (client: string, validateResponse: (response: any) => void): Schedules => {
  const getAllSchedules = async () => {
    const request = await fetch(`${client}/schedule`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    validateResponse(request);
    const response = (await request.json()) as Response;
    return (response.message as unknown) as Schedule[];
  };

  const scheduleMachine = async (schedule: { machineId: number; orderId: number }) => {
    const request = await fetch(`${client}/machine/schedule`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schedule)
    });
    validateResponse(request);
    const response = (await request.json()) as Response;
    return response;
  };

  const freeMachine = async (schedule: { machineId: number; orderId: number }) => {
    const request = await fetch(`${client}/machine/schedule/complete`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schedule)
    });
    validateResponse(request);
    const response = (await request.json()) as Response;
    return response;
  };

  return { getAllSchedules, scheduleMachine, freeMachine };
};
