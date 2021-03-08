import {
    Event as EventModel,
    Goal as GoalModel,
} from './planning.models';
import {ReturnMessage} from './planning.interfaces';
import { config } from '../../config';
import logger from '../shared/Logger';

//**TODO: ADD Logger */
class Service {

    /**
     * Get all the events
     */
    public async getAllEvents(): Promise<ReturnMessage> {
        try{
            const allEvents = await EventModel.getAllEvents();
            return {status: true, message: allEvents};
        } catch (e) {
            logger.error(
                `Failed to get all events`,
                 ['event', 'find', 'failed'],
                 e.message
            );
            return {status: false, message: `Failed while getting all events`};
        }
    }

    /**
     * Delete an event
     * @param eventId the id of the event
     */
    public async deleteEvent(eventId: number): Promise<ReturnMessage> {
        try{
            const res = await EventModel.deleteEvent(eventId);
            return {status: true, message: res};
        } catch (e) {
            logger.error(
                `Failed to delete event with id: ${eventId}`,
                ['event', 'delete', 'id'],
                e.message
            );
            return {status: false, message: `Failed while deleting event of id ${eventId}`};
        }
    }

    /**
     * Add an event
     * @param event the event to be added
     */
    public async addEvent(event: EventModel): Promise<ReturnMessage> {
        try{
            const newEvent = new EventModel({
                date: event.date,
                time: event.time,
                title: event.title,
            });
            const res = await EventModel.addEvent(newEvent);
            return {status: true, message: res};
        } catch (e) {
            logger.error(
                `Failed to add event ${event}`,
                ['event', 'add', 'failed'],
                e.message
            );
            return {status: false, message: `Failed while adding event ${event.id}`};
        }
    }

    /**
     * Get all the goals
     */
    public async getAllGoals(): Promise<ReturnMessage> {
        try{
            const allGoals = await GoalModel.getAllGoals();
            return {status: true, message: allGoals};
        } catch (e) {
            logger.error(
                `Failed to get all goals`,
                ['goal', 'add', 'failed'],
                e.message
            );
            return {status: false, message: `Failed while getting all goals`}
        }
    }

    /**
     * Delete a goal
     * @param goalId the id of the goal
     */
    public async deleteGoal(goalId: number): Promise<ReturnMessage> {
        try{
            const res = await GoalModel.deleteGoal(goalId);
            return {status: true, message: res};
        } catch(e) {
            logger.error(
                `Failed to delete goal with id ${goalId}`,
                ['goal', 'delete', 'failed'],
                e.message
            );
            return {status: false, message: `Failed while deleting goal of id ${goalId}`};
        }
    }

    /**
     * Add a goal
     * @param goal the goal to be added
     */
    public async addGoal(goal: GoalModel): Promise<ReturnMessage> {
        try{
            const newGoal = new GoalModel({
                completed: goal.completed,
                targetDate: goal.targetDate,
                title: goal.title,
            });
            const res = await GoalModel.addGoal(newGoal);
            return {status: true, message: res};
        } catch(e) {
            logger.error(
                `Failed to add goal ${goal}`,
                ['goal', 'add', 'failed'],
                e.message
            );
            return {status: false, message: `Failed while adding goal ${goal.id}`};
        }
    }

    /**
     * update a current goal (mark it as complete)
     * @param goal the goal to be added
     */
    public async updateGoal(
        id: number,
        completed: boolean,
        targetDate: Date,
        title: string
    ): Promise<ReturnMessage> {
        try{
            const newGoal = new GoalModel({
                completed: completed,
                targetDate: targetDate,
                title: title,
            });
            const res = await GoalModel.updateById(id, newGoal);
            return {status: true, message: res};
        } catch(e) {
            logger.error(
                `Failed to update goal with id ${id}`,
                ['goal', 'update', 'failed'],
                e.message
            );
            return {status: false, message: `Failed while updating goal ${id}`};
        }
    }
}

export default Service;
