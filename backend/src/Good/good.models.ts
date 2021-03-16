import logger from '../shared/Logger';
import {
    AnyGood,
    Property,
    Component,
    GoodInterface,
    RawGoodInterface,
    SemiGoodInterface,
    FinishedGoodInterface
} from './good.interfaces';
import db from '../shared/dbConnection';

class Good {
    public name: string;
    public type: string;
    public quantity: number;
    public timeAdded: Date;
    public processTime: number;
    public cost: number;
    public properties: Property[];
    public components: Component[];

    constructor(good: GoodInterface) {
        this.name = good.name;
        this.type = good.type;
        this.quantity = good.quantity || 0;
        this.processTime = good.processTime;
        this.cost = good.cost;
        this.timeAdded = new Date();
        this.properties = good.properties || [];
        this.components = good.components || [];
    }

    /**
     * Retrieve a good from an id
     * @param id the id of the good
     */
    public static async findById(id: number): Promise<AnyGood> {
        const existing = await db()
            .select('inventory_good.*', 'raw_good.vendor', 'finished_good.price')
            .from('inventory_good')
            .leftJoin('raw_good', 'raw_good.id', 'inventory_good.id')
            .leftJoin('finished_good', 'finished_good.id', 'inventory_good.id')
            .leftJoin('semi-finished_good', 'semi-finished_good.id', 'inventory_good.id')
            .where('inventory_good.id', '=', id)
            .first();

        if (existing) {
            return {
                ...existing,
                ...(await this.getPropertiesAndComponents(id))
            };
        }

        return existing;
    }

    /**
     * Retrieve all goods of a type
     * @param type the type of the goods
     * @param archive if we want archive goods or non archived
     */
    public static async getByType(type: string, archive?: boolean): Promise<AnyGood[]> {
        const dbName = `${type}_good`;
        const existing = await db()
            .select('*')
            .from('inventory_good')
            .innerJoin(dbName, `${dbName}.id`, 'inventory_good.id')
            .where('inventory_good.archived', '=', archive ? 1 : 0);

        return await this.getGoodsWithPropertiesAndComponents(existing);
    }

    /**
     * Get all the goods
     */
    public static async getAllGoods(): Promise<AnyGood[]> {
        const existing = await db()
            .select('inventory_good.*', 'raw_good.vendor', 'finished_good.price')
            .from('inventory_good')
            .leftJoin('raw_good', 'raw_good.id', 'inventory_good.id')
            .leftJoin('finished_good', 'finished_good.id', 'inventory_good.id')
            .leftJoin('semi-finished_good', 'semi-finished_good.id', 'inventory_good.id')
            .where('inventory_good.archived', '=', '0');

        return await this.getGoodsWithPropertiesAndComponents(existing);
    }

    /**
     * Get all properties and components of a good
     * @param id the id of the good
     */
    public static async getPropertiesAndComponents(
        id: number
    ): Promise<{ properties: Property[]; components: Component[] }> {
        const properties = await this.getProperties(id);
        const components = await this.getComponents(id);
        return {
            properties: properties,
            components: components
        };
    }

    /**
     * Get a list of goods with components and properties
     */
    public static async getGoodsWithPropertiesAndComponents(goods: any[]): Promise<AnyGood[]> {
        const inventory = await Promise.all(
            goods.map(async (good: any) => {
                return {
                    ...good,
                    ...(await this.getPropertiesAndComponents(good.id))
                };
            })
        );
        return inventory;
    }

    /**
     * Archive good
     * @param id the id of the good
     * @param archive a boolean representing if we want to archive or not
     */
    public static async archive(id: number, archive: boolean): Promise<number> {
        return await db()('inventory_good')
            .update({
                archived: archive ? 1 : 0
            })
            .where('id', '=', id);
    }

    /**
     * Save the good in the table inventory_good
     */
    public async save(): Promise<number> {
        try {
            const newGood = await db()('inventory_good').insert({
                name: this.name,
                type: this.type,
                quantity: this.quantity,
                processTime: this.processTime,
                cost: this.cost
            });
            const id = newGood[0];
            await this.saveProperties(id);
            await this.saveComponents(id);
            return id;
        } catch (e) {
            logger.error('error while save new good', ['good', 'save'], e.message);
            throw e;
        }
    }

    /**
     * Save the properties to the db
     * @param id The id of the composite
     */
    public async saveProperties(id: number) {
        const properties = this.properties.map(p => ({
            ...p,
            compositeId: id
        }));
        let unique: string[];
        unique = [];
        const uniqueProperties = properties.filter(p => {
            if (unique.includes(p.name)) return false;
            unique.push(p.name);
            return true;
        });
        await db()('property_of_good').insert(uniqueProperties);
    }

    /**
     * Save the components to the db
     * @param id The id of the composite
     */
    public async saveComponents(id: number) {
        const components = this.components.map(c => ({
            quantity: c.quantity,
            componentId: c.id,
            compositeId: id
        }));
        let unique: number[];
        unique = [];
        const uniqueComponents = components.filter(c => {
            if (unique.includes(c.componentId)) return false;
            unique.push(c.componentId);
            return true;
        });
        await db()('composition_of_good').insert(uniqueComponents);
    }

    /**
     * Returns a list of the composite properties
     * @param id The id of the composite
     */
    public static async getProperties(id: number): Promise<Property[]> {
        return await db()('property_of_good').select('name', 'value').where('compositeId', id);
    }

    /**
     * Returns a list of the composite components
     * @param id The id of the composite
     */
    public static async getComponents(id: number): Promise<Component[]> {
        return await db()
            .select('componentId as id', 'name', 'composition_of_good.quantity')
            .from('composition_of_good')
            .innerJoin('inventory_good', 'componentId', 'id')
            .where('compositeId', id);
    }

    /**
     * Get the current quantity of good
     * @param id The id of the composite
     */
    public static async getCurrentQuantity(id: number): Promise<number> {
        const existing = await db()
            .select('quantity')
            .from('inventory_good')
            .where('inventory_good.id', '=', id)
            .first();
        return existing.quantity;
    }

    /**
     * Decrement the quantity of the good
     * @param id The id of the good
     * @param dec The amount to decrement
     */
    public static async decrementGoodQuantity(id: number, dec: number): Promise<number> {
        return await db()('inventory_good').decrement('quantity', dec).where('id', '=', id);
    }

    /**
     * Increment the quantity of the good
     * @param id The id of the good
     * @param inc The amount to increment
     */
    public static async incrementGoodQuantity(id: number, inc: number): Promise<number> {
        return await db()('inventory_good').increment('quantity', inc).where('id', '=', id);
    }
}

class RawGood extends Good {
    public cost: number;
    public vendor: string;

    constructor(rawGood: RawGoodInterface) {
        super({ ...rawGood, type: 'raw' });
        this.cost = rawGood.cost;
        this.vendor = rawGood.vendor;
    }

    /**
     * Save good to database
     */
    public async save(): Promise<number> {
        let id = await super.save();
        try {
            const temp = await db()('raw_good').insert({
                vendor: this.vendor,
                id: id
            });
            return id;
        } catch (e) {
            logger.error('error while save new good', ['good', 'raw', 'save'], e.message);
            throw e;
        }
    }
}

class SemiFinishedGood extends Good {
    public cost: number;

    constructor(semiGood: SemiGoodInterface) {
        super({ ...semiGood, type: 'semi-finished' });
        this.cost = semiGood.cost;
    }

    /**
     * Save good to database
     */
    public async save(): Promise<number> {
        let id = await super.save();
        try {
            await db()('semi-finished_good').insert({
                id: id
            });
            return id;
        } catch (e) {
            logger.error('error while save new good', ['good', 'semi-finished', 'save'], e.message);
            throw e;
        }
    }
}

class FinishedGood extends Good {
    public cost: number;
    public price: number;

    constructor(finishedGood: FinishedGoodInterface) {
        super({ ...finishedGood, type: 'finished' });
        this.cost = finishedGood.cost;
        this.price = finishedGood.price;
    }

    /**
     * Save good to database
     */
    public async save(): Promise<number> {
        const id = await super.save();
        try {
            await db()('finished_good').insert({
                price: this.price,
                id: id
            });
            return id;
        } catch (e) {
            logger.error('error while save new good', ['good', 'finished', 'save'], e.message);
            throw e;
        }
    }
}

export { RawGood, Good, SemiFinishedGood, FinishedGood };
