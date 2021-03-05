import {
    Event as EventModel,
    Goal as GoalModel,
} from './planning.models';
import { config } from '../../config';
import logger from '../shared/Logger';

//**TODO: ADD Logger */
class Service {

    /**
     * Get all the events
     */
    public async getAllEvents(): Promise<EventModel[]> {
        const allEvents = await EventModel.getAllEvents();
        return allEvents;
    }

    /**
     * Delete an event
     * @param eventId the id of the event
     */
    public async deleteEvent(eventId: number): Promise<number> {
        const res = await EventModel.deleteEvent(eventId);
        return res;
    }

    /**
     * Add an event
     * @param event the event to be added
     */
    public async addEvent(event: EventModel): Promise<number> {
        const newEvent = new EventModel({
            date: event.date,
            time: event.time,
            title: event.title,
        });
        const res = await EventModel.addEvent(newEvent);
        return res;
    }

    /**
     * Get all the goals
     */
    public async getAllGoals(): Promise<GoalModel[]> {
        const allGoals = await GoalModel.getAllGoals();
        return allGoals;
    }

    /**
     * Delete a goal
     * @param goalId the id of the goal
     */
    public async deleteGoal(goalId: number): Promise<number> {
        const res = await GoalModel.deleteGoal(goalId);
        return res;
    }

    /**
     * Add a goal
     * @param goal the goal to be added
     */
    public async addGoal(goal: GoalModel): Promise<number> {
        const newGoal = new GoalModel({
            completed: goal.completed,
            targetDate: goal.targetDate,
            title: goal.title,
        });
        const res = await GoalModel.addGoal(newGoal);
        return res;
    }

    /**
     * update a current goal (mark it as complete)
     * @param goal the goal to be added
     */
    public async updateGoal(goal: GoalModel): Promise<number> {
        const newGoal = new GoalModel({
            completed: goal.completed,
            targetDate: goal.targetDate,
            title: goal.title,
        });
        const res = await GoalModel.updateById(goal.id, goal);
        return res;
    }
}

export default Service;
