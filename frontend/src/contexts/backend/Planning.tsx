interface Response {
  status: boolean;
  message: string;
}

interface Event {
  id: number;
  date: string;
  time: string;
  title: string;
}

interface Goal {
  id: number;
  completed: boolean;
  targetDate: string;
  title: string;
}

export interface Planning {
  // Events
  getAllEvents: () => Promise<Event[]>;
  addEvent: (date: string, time: string, title: string) => Promise<Response>;
  deleteEvent: (id: string | number) => Promise<Response>;

  // Goals
  getAllGoals: () => Promise<Goal[]>;
  addGoal: (title: string, targetDate: string) => Promise<Response>;
  updateGoal: (
    id: string | number,
    completed: boolean,
    targetDate: string,
    title: string
  ) => Promise<Response>;
  deleteGoal: (id: string | number) => Promise<Response>;
}

export const planning = (client: string): Planning => {
  // ***************************************
  // EVENTS
  // ***************************************

  /**
   * Get all events.
   * @returns A list of events.
   */
  const getAllEvents = async () => {
    const request = await fetch(`${client}/planning/events`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const events = response.message as Event[];
    return events;
  };

  /**
   * Create a new event.
   * @param date Date of the event with format ``yyyy-mm-dd``.
   * @param time Time of the event with format ``hh:mm:ss``.
   * @param title Title of the event.
   * @returns The validation response.
   */
  const addEvent = async (date: string, time: string, title: string) => {
    const request = await fetch(`${client}/planning/events`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, time, title })
    });

    const response = (await request.json()) as Response;
    return response;
  };

  /**
   * Delete an event.
   * @param id The ID of the event.
   * @returns The validation response.
   */
  const deleteEvent = async (id: string | number) => {
    const request = await fetch(`${client}/planning/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      }
    });

    const response = (await request.json()) as Response;
    return response;
  };

  // ***************************************
  // GOALS
  // ***************************************

  /**
   * Get all goals.
   * @returns A list of goals.
   */
  const getAllGoals = async () => {
    const request = await fetch(`${client}/planning/goals`, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const goals = response.message as Goal[];
    return goals;
  };

  /**
   * Create a new goal.
   * @param title Title of the goal.
   * @param targetDate Date of the goal with format ``yyyy-mm-dd``.
   * @returns The validation response.
   */
  const addGoal = async (title: string, targetDate: string) => {
    const request = await fetch(`${client}/planning/goals`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, targetDate })
    });

    const response = (await request.json()) as Response;
    return response;
  };

  /**
   * Update a goal.
   * @param id The ID of the goal.
   * @param complete Whether the goal is completed or not.
   * @param title Title of the goal.
   * @param targetDate Date of the goal with format ``yyyy-mm-dd``.
   * @returns The validation response.
   */
  const updateGoal = async (
    id: string | number,
    completed: boolean,
    targetDate: string,
    title: string
  ) => {
    const request = await fetch(`${client}/planning/goals/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, completed, targetDate, title })
    });
    const response = (await request.json()) as Response;
    return response;
  };

  /**
   * Delete a goal.
   * @param id The ID of the goal.
   * @returns The validation response.
   */
  const deleteGoal = async (id: string | number) => {
    const request = await fetch(`${client}/planning/goals/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      }
    });

    const response = (await request.json()) as Response;
    return response;
  };

  return {
    getAllEvents,
    addEvent,
    deleteEvent,
    getAllGoals,
    addGoal,
    updateGoal,
    deleteGoal
  };
};
