interface ReturnMessage {
    status: boolean;
    message: any | any[];
}

interface ScheduleSchema {
    machineId: number;
    orderId: number;
}

export { ReturnMessage, ScheduleSchema };
