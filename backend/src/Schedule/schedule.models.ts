import { get_connection as db } from '../shared/dbConnection';

class Schedule {
    public machineId: number;
    public orderId: number;

    constructor(machineId: number, orderId: number) {
        this.machineId = machineId;
        this.orderId = orderId;
    }

    /**
     * Save the schedule to the database
     */
    public async save() {
        await db()('schedule').insert({
            machineId: this.machineId,
            orderId: this.orderId
        });
    }

    /**
     * Delete a schedule
     */
    public async delete() {
        await db()('schedule').where('machineId', this.machineId).del();
    }

    /**
     * Get all schedules
     */
    public static async getAllSchedules() {
        const res = await db().raw(`
            SELECT RES.machineId, RES.orderId, MAN.estimatedEndDate as finishTime, RES.status
            FROM (
                SELECT M.machineId, schedule.orderId, M.status
                FROM schedule
                RIGHT JOIN machine M
                ON M.machineId = schedule.machineId
                ) as RES
            LEFT JOIN manufacturing_order MAN
            ON RES.orderId = MAN.orderId
        `);
        return res;
    }
}

export { Schedule };
