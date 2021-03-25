import MachineModel from './machine.models';
import ScheduleService from '../Schedule/schedule.service';

// Service which allows the creation of machines and their modification.
class Service {
    public scheduleService: ScheduleService;

    constructor(scheduleService?: ScheduleService) {
        this.scheduleService = scheduleService || new ScheduleService();
    }

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

    /**
     * Schedule the machine for an order
     * @param machineId the id of a machine
     * @param orderId the id of an order
     * @returns a return message
     */
    public async scheduleMachine(machineId: number, orderId: number): Promise<any> {
        const machine = await this.findMachineById(machineId);
        if (!machine || machine.status === 'busy')
            return { status: false, message: 'Machine does not exist or is not available' };

        const res = await this.scheduleService.createNewSchedule(machineId, orderId);
        if (!res.status) return res;

        this.updateMachine(machineId, 'busy', machine.numberOrderCompleted);
        return res;
    }

    /**
     * Complete a schedule and free machine
     * @param machineId the id of a machine
     * @param orderId the id of an order
     * @returns a return message
     */
    public async freeMachine(machineId: number, orderId: number): Promise<any> {
        const machine = await this.findMachineById(machineId);
        if (!machine || machine.status === 'free')
            return { status: false, message: 'Machine does not exist or is already free' };

        const res = await this.scheduleService.completeSchedule(machineId, orderId);
        if (!res.status) return res;

        this.updateMachine(machineId, 'free', machine.numberOrderCompleted + 1);
        return res;
    }
}

export default Service;
