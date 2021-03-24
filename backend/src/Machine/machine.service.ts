import MachineModel from './machine.models';

// Service which allows the creation of machines and their modification.
class Service {
    // Return all machines.
    public async getAllMachines(): Promise<MachineModel[]> {
        const allMachines = await MachineModel.getAll();
        return allMachines;
    }

    // Return all machines corresponding to the given status (free or busy).
    public async getAllMachinesByStatus(status: string): Promise<MachineModel[]> {
        const allMachines = await MachineModel.getAllByStatus(status);
        return allMachines;
    }

    // Create a new machine.
    public async createNewMachine(): Promise<number> {
        const newMachine = new MachineModel({
            status: 'free', // By default, when a machine is created, it is free and is ready to start processing an order.
            numberOrderCompleted: 0 // By default, when a machine is created, it has not completed any orders.
        });

        return await MachineModel.addMachine(newMachine);
    }

    // Find a machine with its id.
    public async findMachineById(id: number): Promise<MachineModel> {
        const machine = await MachineModel.findById(id);
        return machine;
    }

    // Update the status and/or the number of orders completed of a machine by its id.
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

    // Delete a machine by its id.
    public async deleteMachine(id: number): Promise<number> {
        try {
            return await MachineModel.deleteMachine(id);
        } catch (e) {
            return Promise.reject(
                'The machine you want to delete cannot be deleted as it is currently busy.'
            );
        }
    }

    // Delete all machines.
    public async deleteAll(): Promise<number> {
        try {
            return await MachineModel.deleteAll();
        } catch (e) {
            return Promise.reject('All the machines could not be deleted since some are busy.');
        }
    }
}

export default Service;
