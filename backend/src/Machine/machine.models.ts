import { get_connection as db } from '../shared/dbConnection';

class Machine {
    public machineId!: number;
    public status: string;
    public numberOrderCompleted: number;

    constructor(machine: { status: string; numberOrderCompleted: number }) {
        this.status = machine.status;
        this.numberOrderCompleted = machine.numberOrderCompleted;
    }

    public static async getAll(): Promise<Machine[]> {
        return await db()('machine').select('machineId', 'status', 'numberOrderCompleted');
    }

    public static async addMachine(machine: Machine): Promise<number> {
        return await db()('machine').insert(machine);
    }

    public static async findById(machineId: number): Promise<Machine> {
        return await db()('machine')
            .select('machineId', 'status', 'numberOrderCompleted')
            .where('machineId', machineId)
            .first();
    }

    public static async updateById(machineId: number, machine: Machine): Promise<number> {
        return await db()('machine')
            .update({
                status: machine.status,
                numberOrderCompleted: machine.numberOrderCompleted
            })
            .where('machineId', machineId);
    }

    public static async deleteMachine(machineId: number): Promise<number> {
        return await db()('machine').where('machineId', machineId).del();
    }

    public static async deleteAll(): Promise<number> {
        const result = await db()('machine').del();
        await db().raw('ALTER TABLE machine AUTO_INCREMENT = 1');
        return result;
    }
}

export default Machine;
