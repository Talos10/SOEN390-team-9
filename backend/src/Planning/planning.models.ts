import { EventInterface, GoalInterface } from './planning.interfaces';
import db from '../shared/dbConnection';

class Event {
    public id!: number;
    public date: Date;
    public time: Date;
    public title: string;

    constructor(event: EventInterface) {
        this.date = event.date;
        this.time = event.time;
        this.title = event.title;
    }

    /**
     * Get all the events
     */
    public static async getAllEvents(): Promise<Event[]> {
        return await db()('event').select('*');
    }

    /**
     * Delete an event
     * @param eventId the id of the event
     */
    public static async deleteEvent(eventId: number): Promise<number> {
        return await db()('event').where('id', eventId).del();
    }

    /**
     * Add an event
     * @param event the event to be added
     */
    public static async addEvent(event: Event): Promise<number> {
        return await db()('event').insert(event);
    }
}

class Goal {
    public id!: number;
    public completed: boolean;
    public targetDate: Date;
    public title: string;

    constructor(goal: GoalInterface) {
        this.completed = goal.completed;
        this.targetDate = goal.targetDate;
        this.title = goal.title;
    }

    /**
     * Get all the goals
     */
    public static async getAllGoals(): Promise<Goal[]> {
        return await db()('goal').select('*');
    }

    /**
     * Delete a goal
     * @param goaldId the id of the goal
     */
    public static async deleteGoal(goalId: number): Promise<number> {
        return await db()('goal').where('id', goalId).del();
    }

    /**
     * Add a goal
     * @param goal the goal to be added
     */
    public static async addGoal(goal: Goal): Promise<number> {
        return await db()('goal').insert(goal);
    }

    /**
     *
     * @param goalId the id of the goal we wish to update
     * @param goal the updated goal
     */
    public static async updateById(goalId: number, goal: Goal): Promise<number> {
        return await db()('goal')
            .update({
                completed: goal.completed,
                targetDate: goal.targetDate,
                title: goal.title
            })
            .where('id', goalId);
    }
}

export { Event, Goal };
