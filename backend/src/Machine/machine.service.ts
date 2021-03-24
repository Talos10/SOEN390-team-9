import MachineModel from './machine.models';
import ScheduleService from '../Schedule/schedule.service';
class Service {
    public scheduleService: ScheduleService;

    constructor(scheduleService?: ScheduleService) {
        this.scheduleService = scheduleService || new ScheduleService();
    }

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
