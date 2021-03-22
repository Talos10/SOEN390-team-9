interface User {
  userID: number;
  name: string;
  role: string;
  email: string;
}

interface Response {
  status: boolean;
  message: string;
  error: string;
}

export interface Admin {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) => Promise<Response>;
  changeRole: (user: User, role: string) => Promise<Response>;
  deleteUser: (userID: { userID: number }) => Promise<Response>;
}

export const admin = (client: string): Admin => {
  const getAllUsers = async () => {
    const request = await fetch(`${client}/user/`, {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    const response = (await request.json()) as User[];
    return response;
  };

  const addUser = async (user: { name: string; email: string; role: string; password: string }) => {
    const request = await fetch(`${client}/user/`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const response = (await request.json()) as Response;
    return response;
  };

  const changeRole = async (user: User, role: string) => {
    const { userID, name, email } = user;
    const request = await fetch(`${client}/user/${userID}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID, name, email, role })
    });

    const response = (await request.json()) as Response;
    return response;
  };

  const deleteUser = async ({ userID }: { userID: number }) => {
    const request = await fetch(`${client}/user/${userID}`, {
      method: 'DELETE',
      headers: { Authorization: `bearer ${localStorage.token}` }
    });

    const response = (await request.json()) as Response;
    return response;
  };

  return { getAllUsers, addUser, changeRole, deleteUser };
};
