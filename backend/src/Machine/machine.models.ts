import { get_connection as db } from '../shared/dbConnection';

// This class represents the blueprint (i.e attributes and methods) of the machines
// that will be used to process the orders.
class Machine {
    public machineId!: number; // The id of the machine
    public status: string; // The status of the machine: free (machine isn't currently processing an order) or busy (machine is currently processing an order)
    public numberOrderCompleted: number; // The number of orders that a machine has completed since it has been created.

    // Constructor to create a machine.
    constructor(machine: { status: string; numberOrderCompleted: number }) {
        this.status = machine.status;
        this.numberOrderCompleted = machine.numberOrderCompleted;
    }

    // Return all the machines from the database.
    public static async getAll(): Promise<Machine[]> {
        return await db()('machine').select('machineId', 'status', 'numberOrderCompleted');
    }

    // Add a machine to the database.
    public static async addMachine(machine: Machine): Promise<number> {
        return await db()('machine').insert(machine);
    }

    // Find a machine by its id in the database.
    public static async findById(machineId: number): Promise<Machine> {
        return await db()('machine')
            .select('machineId', 'status', 'numberOrderCompleted')
            .where('machineId', machineId)
            .first();
    }

    // Update a machine by its id in the database.
    public static async updateById(machineId: number, machine: Machine): Promise<number> {
        return await db()('machine')
            .update({
                status: machine.status,
                numberOrderCompleted: machine.numberOrderCompleted
            })
            .where('machineId', machineId);
    }

    // Delete a machine by its id in the database.
    public static async deleteMachine(machineId: number): Promise<number> {
        return await db()('machine').where('machineId', machineId).del();
    }

    // Delete all machines in the database.
    public static async deleteAll(): Promise<number> {
        const result = await db()('machine').del();
        await db().raw('ALTER TABLE machine AUTO_INCREMENT = 1');
        return result;
    }
}

export default Machine;
