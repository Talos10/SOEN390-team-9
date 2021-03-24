import MachineModel from './machine.models';

class Service {
    public async getAllMachines(): Promise<MachineModel[]> {
        const allMachines = await MachineModel.getAll();
        return allMachines;
    }

    public async createNewMachine(status: string, numberOrderCompleted: number): Promise<number> {
        const newMachine = new MachineModel({
            status: status,
            numberOrderCompleted: numberOrderCompleted
        });

        return await MachineModel.addMachine(newMachine);
    }

    public async findMachineById(id: number): Promise<MachineModel> {
        const machine = await MachineModel.findById(id);
        return machine;
    }

    public async updateMachine(
        machineId: number,
        status: string,
        numberOrderCompleted: number
    ): Promise<number> {
        const newMachine = new MachineModel({
            status: status,
            numberOrderCompleted: numberOrderCompleted
        });
        const res = await MachineModel.updateById(machineId, newMachine);
        return res;
    }

    public async deleteMachine(id: number): Promise<number> {
        try {
            return await MachineModel.deleteMachine(id);
        } catch (e) {
            return Promise.reject(
                'The machine you want to delete cannot be deleted as it is currently busy.'
            );
        }
    }

    public async deleteAll(): Promise<number> {
        try {
            return await MachineModel.deleteAll();
        } catch (e) {
            return Promise.reject('All the machines could not be deleted since some are busy.');
        }
    }
}

export default Service;
