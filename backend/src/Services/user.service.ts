import UserModel from '../Models/user.model';

class Service {

    public async getAllUsers() {
        const allUsers = await UserModel.getAll();
        return allUsers;
    }

    public async createNewUser(name: string, role: string, email: string, password: string) {
        const newUser = new UserModel({
            name: name,
            role: role,
            email: email,
            password: password
        });
        const res = await UserModel.addUser(newUser);
        return res;
    }

    public async findUserById(id: number) {
        const user = await UserModel.findById(id);
        return user;
    }

    public async findUserByAuth(email: string, password: string) {
        const user = await UserModel.findByIdAuth(email, password);
        return user;
    }

    public async updateUser(id: number, name: string, role: string, email: string, password: string) {
        const newUser = new UserModel({
            name: name,
            role: role,
            email: email,
            password: password
        });
        const res = await UserModel.updateById(id, newUser);
        return res;
    }

    public async deleteUser(id: number) {
        const res = await UserModel.deleteUser(id);
        return res;
    }

    public async deleteAll() {
        const res = await UserModel.deleteAll();
        return res;
    }
}

export default Service;
