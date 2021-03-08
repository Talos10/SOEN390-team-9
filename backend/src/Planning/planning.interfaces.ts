interface EventInterface {
    date: Date;
    time: Date;
    title: string;
}

interface GoalInterface {
    completed: boolean;
    targetDate: Date;
    title: string;
}

 interface ReturnMessage {
     status: boolean;
     message: any | any[];
     good?: any;
 }

export {EventInterface, GoalInterface, ReturnMessage};
