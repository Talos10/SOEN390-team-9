import {
    Event as EventModel,
    Goal as GoalModel,
} from './planning.models';
import { config } from '../../config';
import logger from '../shared/Logger';

class Service {

    public async getAllEvents(): Promise<EventModel[]> {
        const allEvents = await EventModel.getAllEvents();
        return allEvents;
    }

    public async deleteEvent(eventId: number): Promise<number> {
        const res = await EventModel.deleteEvent(eventId);
        return res;
    }

    public async addEvent(event: EventModel): Promise<number> {
        const newEvent = new EventModel({
            date: event.date,
            time: event.time,
            title: event.title,
        });
        const res = await EventModel.addEvent(newEvent);
        return res;
    }

    public async getAllGoals(): Promise<GoalModel[]> {
        const allGoals = await GoalModel.getAllGoals();
        return allGoals;
    }

    public async deleteGoal(goalId: number): Promise<number> {
        const res = await GoalModel.deleteGoal(goalId);
        return res;
    }

    public async addGoal(goal: GoalModel): Promise<number> {
        const newGoal = new GoalModel({
            completed: goal.completed,
            targetDate: goal.targetDate,
            title: goal.title,
        });
        const res = await GoalModel.addGoal(newGoal);
        return res;
    }

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
