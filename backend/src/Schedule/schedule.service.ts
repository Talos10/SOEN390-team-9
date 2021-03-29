import { ReturnMessage } from './schedule.interfaces';
import ManufacturingService from '../Manufacturing/manufacturing.service';
import logger from '../shared/Logger';
import { config } from '../../config';
import { Schedule } from './schedule.models';

class Service {
    public manufacturingService: ManufacturingService;

    constructor(manufacturingService?: ManufacturingService) {
        this.manufacturingService = manufacturingService || new ManufacturingService();
    }

    /**
     * Set an order to in progress and schedule the order
     * @param machineId the id of the machine
     * @param orderId the id of the order
     * @returns a return message
     */
    public async createNewSchedule(machineId: number, orderId: number): Promise<ReturnMessage> {
        const temp = await this.manufacturingService.getOrderFromId(orderId);

        if (!temp.status) return { status: false, message: 'Unable to find order' };
        if (temp.message.status !== config.manufacturing.status.confirm)
            return { status: false, message: 'Order is not confirmed' };

        const res = await this.manufacturingService.updateSingleOrderStatus(
            orderId,
            config.manufacturing.status.process
        );
        if (!res.status) return res;

        const newSchedule = new Schedule(machineId, orderId);
        try {
            newSchedule.save();
            logger.info('Successfully saved new schedule');
            return { status: true, message: 'Successfully saved new schedule' };
        } catch (e) {
            logger.error('Failed to save schedule', ['schedule', 'save'], e.message);
            return { status: false, message: 'Failed to save new schedule' };
        }
    }

    /**
     * Set an order to complete and delete the schedule
     * @param machineId the id of the machine
     * @param orderId the id of the order
     * @returns a return message
     */
    public async completeSchedule(machineId: number, orderId: number): Promise<ReturnMessage> {
        const res = await this.manufacturingService.updateSingleOrderStatus(
            orderId,
            config.manufacturing.status.complete
        );
        if (!res.status) return res;

        const schedule = new Schedule(machineId, orderId);
        try {
            schedule.delete();
            logger.info('Successfully deleted schedule');
            return { status: true, message: 'Successfully deleted schedule' };
        } catch (e) {
            logger.error('Failed to delete schedule', ['schedule', 'delete'], e.message);
            return { status: false, message: 'Failed to delete schedule' };
        }
    }

    /**
     * Get all of the schedules with estimated finish time
     * @returns a all schedules
     */
    public async getAllSchedule(): Promise<ReturnMessage> {
        let res = await Schedule.getAllSchedules();
        return { status: true, message: res[0] };
    }
}

export default Service;
