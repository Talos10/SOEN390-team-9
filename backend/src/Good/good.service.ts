import {
    RawGood as RawModel,
    Good as GoodModel,
    SemiFinishedGood as SemiModel,
    FinishedGood as FinishModel
} from './good.models';
import { Property, Component, ReturnMessage } from './good.interfaces';
import { config } from '../../config';
import logger from '../shared/Logger';

class Service {
    /**
     * Get all the goods in the database
     */
    public async getAllGoods(): Promise<ReturnMessage> {
        try {
            const goods = await GoodModel.getAllGoods();
            return { status: true, message: this.cleanUpMultipleOfGoods(goods) };
        } catch (e) {
            logger.error(`Failed to get all goods`, ['good', 'find', 'good'], e.message);
            return { status: false, message: `Failed while getting all goods` };
        }
    }

    /**
     * Gets a good by id
     * @param id The id of the good
     */
    public async getSingleGood(id: number): Promise<ReturnMessage> {
        try {
            const good = await GoodModel.findById(id);
            return good
                ? { status: true, message: this.cleanUpGood(good) }
                : { status: false, message: `Good with id: ${id} not found` };
        } catch (e) {
            logger.error(
                `Failed to get good by id with id: ${id}`,
                ['good', 'find', 'id'],
                e.message
            );
            return { status: false, message: `Failed while getting good with id ${id}` };
        }
    }

    /**
     * Get all goods of a specific type
     * @param type The type of goods
     */
    public async getAllGoodsOfType(type: string): Promise<ReturnMessage> {
        try {
            const goods = await GoodModel.getByType(type);
            return { status: true, message: this.cleanUpMultipleOfGoods(goods) };
        } catch (e) {
            logger.error(
                `Failed to get goods by type with type: ${type}`,
                ['good', 'find', 'type'],
                e.message
            );
            return { status: false, message: `Failed while getting goods with type ${type}` };
        }
    }

    /**
     * Get all goods of a specific type
     * @param type The type of goods
     */
    public async getAllArchivedGoodsOfType(type: string): Promise<ReturnMessage> {
        try {
            const goods = await GoodModel.getByType(type, true);
            return { status: true, message: this.cleanUpMultipleOfGoods(goods) };
        } catch (e) {
            logger.error(
                `Failed to get archived goods by type with type: ${type}`,
                ['good', 'find', 'type', 'archive'],
                e.message
            );
            return {
                status: false,
                message: `Failed while getting archived goods with type ${type}`
            };
        }
    }

    /**
     * Clean up the good by removing uncessary fields
     * @param good a good
     */
    public cleanUpGood(good: any): any {
        switch (good.type) {
            case 'raw':
                delete good['price'];
                break;
            case 'semi-finished':
                delete good['price'];
                delete good['vendor'];
                break;
            case 'finished':
                delete good['vendor'];
                break;
        }
        return good;
    }

    /**
     * Clean up the goods by removing uncessary fields
     * @param goods an array of goods
     */
    public cleanUpMultipleOfGoods(goods: any[]): any[] {
        return goods.map(good => {
            return this.cleanUpGood(good);
        });
    }

    /**
     * Archive multiple goods
     * @param goods an array of ids
     */
    public async archiveMultipleGoods(goods: any[]): Promise<ReturnMessage[]> {
        return await Promise.all(
            goods.map(async good => {
                return await this.archiveGood(good.id, good.archive);
            })
        );
    }

    /**
     * Archive or un-archive a good
     * @param id the id of the good
     * @param archive a boolean if we want to archive or not
     */
    public async archiveGood(id: number, archive: boolean): Promise<ReturnMessage> {
        try {
            if (await GoodModel.archive(id, archive)) {
                logger.info(
                    `${archive ? 'archive' : 'un-archive'} successful for good with id: ${id}`,
                    ['good', 'archive']
                );
                return {
                    status: true,
                    message: `${
                        archive ? 'archive' : 'un-archive'
                    } successfull for good with id: ${id}`
                };
            }
            return {
                status: false,
                message: `Failed to ${
                    archive ? 'archive' : 'un-archive'
                } good with id ${id}, good not found`
            };
        } catch (e) {
            logger.error(
                `Failed to ${archive ? 'archive' : 'un-archive'} good with id: ${id}`,
                ['good', 'archive'],
                e.message
            );
            return {
                status: false,
                message: `Failed to ${archive ? 'archive' : 'un-archive'} good with id ${id}`
            };
        }
    }

    /**
     * Add many new goods
     * @param goods goods to save
     */
    public async addBulkGoods(goods: any[]): Promise<ReturnMessage[]> {
        return await Promise.all(
            goods.map(async good => {
                return await this.addSingleGood(good);
            })
        );
    }

    /**
     * Add a single good to the database
     * @param good The good we want to add
     */
    public async addSingleGood(good: any): Promise<ReturnMessage> {
        if (!this.validateGoodFormat(good))
            return { status: false, message: 'Failed while validating good', good: good };

        if (good.components) {
            const notExist = await this.checkIfComponentExists(good.components);
            if (notExist.length > 0)
                return {
                    status: false,
                    message: `Failed to save component: ${notExist.join(', ')} does not exist`,
                    good: good
                };
        }

        try {
            switch (good.type) {
                case 'raw':
                    await new RawModel(good).save();
                    break;
                case 'semi-finished':
                    await new SemiModel(good).save();
                    break;
                case 'finished':
                    await new FinishModel(good).save();
                    break;
            }
            logger.info('Successfully saved new good', ['good', 'save', 'success'], good);
            return { status: true, message: 'Successfully saved new good', good: good };
        } catch (e) {
            logger.error(
                'Failed while attempting to save good',
                ['good', 'save', 'failed'],
                e.message
            );
            return { status: false, message: 'Failed while saving good', good: good };
        }
    }

    /**
     * Validates the format of a good
     * @param good The good we want to validate
     */
    public validateGoodFormat(good: any): boolean {
        // Check if the name, type, cost and processTime is valid
        if (
            typeof good.name !== 'string' ||
            typeof good.type !== 'string' ||
            typeof good.processTime !== 'number' ||
            typeof good.cost !== 'number' ||
            good.cost < 0 ||
            good.processTime < 0 ||
            !config.good.types.includes(good.type)
        )
            return false;

        // Check specific fields depending on the type
        switch (good.type) {
            case 'raw':
                if (typeof good.vendor !== 'string') return false;
                break;
            case 'semi-finished':
                break;
            case 'finished':
                if (typeof good.price !== 'number' || good.price < 0) return false;
                break;
        }

        // Check the components and the properties fields
        if (good.properties) {
            let validProperties = true;
            good.properties.forEach((p: Property) => {
                if (!this.validateProperties(p)) validProperties = false;
            });
            if (!validProperties) return false;
        }
        if (good.components) {
            let validComponents = true;
            good.components.forEach((c: Component) => {
                if (!this.validateComponent(c)) validComponents = false;
            });
            if (!validComponents) return false;
        }

        return true;
    }

    /**
     * Check the format of a property
     * @param property the property to check
     */
    public validateProperties(property: Property): boolean {
        return typeof property.name === 'string' && typeof property.value === 'string';
    }

    /**
     * Check the format of a component
     * @param component the component to check
     */
    public validateComponent(component: Component): boolean {
        return (
            typeof component.id === 'number' &&
            component.id > 0 &&
            typeof component.quantity === 'number' &&
            component.quantity > 0
        );
    }

    /**
     * Returns a list of non existing components
     * @param components the components we want to check
     */
    public async checkIfComponentExists(components: Component[]): Promise<number[]> {
        const onlyId = components.map(c => c.id);
        let invalidComponents: number[];
        invalidComponents = [];
        await Promise.all(
            onlyId.map(async id => {
                const c = await this.getSingleGood(id);
                if (!c.status) invalidComponents.push(id);
            })
        );
        return invalidComponents;
    }

    /**
     * Verify if we have the necessary components to make a good
     * @param goods aa list of goods with quantities
     */
    public async validateComponentsQuantities(
        requiredComponents: Component[]
    ): Promise<Component[]> {
        let missingComponents: Component[];
        missingComponents = [];
        await Promise.all(
            requiredComponents.map(async component => {
                const res = await this.validateSingleGoodQuantity(component.id, component.quantity);
                if (res.quantity !== 0) missingComponents.push(res);
            })
        );
        return missingComponents;
    }

    /**
     * Validate if we have enough quantity of good
     * @param id the id of the good
     * @param requiredQuantity the amount we need
     */
    public async validateSingleGoodQuantity(
        id: number,
        requiredQuantity: number
    ): Promise<Component> {
        const currentQuantity = await GoodModel.getCurrentQuantity(id);
        if (currentQuantity < requiredQuantity)
            return { id: id, quantity: requiredQuantity - currentQuantity };
        return { id: id, quantity: 0 };
    }

    /**
     * Compile component required
     * @param ids a list of composite to build
     * @param quantity the amount of composite to build
     */
    public async compileRequiredComponents(goods: Component[]): Promise<Component[]> {
        let quantities: number[];
        quantities = [];
        await Promise.all(
            goods.map(async good => {
                const components = await this.getRequiredComponents(good.id, good.quantity);
                components.forEach(c => {
                    quantities[c.id] = quantities[c.id]
                        ? quantities[c.id] + c.quantity
                        : c.quantity;
                });
            })
        );

        return quantities
            .map((quantity, id) => {
                return {
                    id: id,
                    quantity: quantity
                };
            })
            .filter(c => c !== null);
    }

    /**
     * Get component required for a good
     * @param id
     * @param quantity
     */
    public async getRequiredComponents(id: number, quantity: number): Promise<Component[]> {
        const requiredComponents = await GoodModel.getComponents(id);
        return requiredComponents.map(c => ({
            id: c.id,
            quantity: c.quantity * quantity
        }));
    }

    /**
     * Get the materials necessary to make goods
     * @param goods A list of goods to make
     */
    public async allocateMaterialsForGoods(goods: Component[]): Promise<ReturnMessage> {
        const requiredComponents = await this.compileRequiredComponents(goods);
        return await this.decrementQuantitiesOfGoods(requiredComponents);
    }

    /**
     * Get Decrement the goods
     * @param requiredComponents A list of goods to decrement
     */
    public async decrementQuantitiesOfGoods(
        requiredComponents: Component[]
    ): Promise<ReturnMessage> {
        const missing = await this.validateComponentsQuantities(requiredComponents);
        if (missing.length !== 0) return { status: false, message: missing };

        try {
            await Promise.all(
                requiredComponents.map(async component => {
                    const res = await GoodModel.decrementGoodQuantity(
                        component.id,
                        component.quantity
                    );
                    if (!res) throw new Error('Failed to decrement quantity');
                })
            );
            return { status: true, message: 'successfully decremented quantites' };
        } catch (e) {
            logger.error(
                'Failed while decrementing quantity of good',
                ['good', 'decrement'],
                e.message
            );
        }
        return { status: false, message: 'Failed to decremented quantites' };
    }

    /**
     * Increment the quantities of a list of goods
     * @param goods a list of goods
     */
    public async incrementQuantitiesOfGoods(goods: Component[]): Promise<boolean> {
        let success = true;
        try {
            await Promise.all(
                goods.map(async good => {
                    const res = await this.incrementSingleGoodQuantity(good.id, good.quantity);
                    if (!res) success = false;
                })
            );
            if (!success) throw new Error('Incrementation failed');
            return true;
        } catch (e) {
            logger.error(
                `Failed while incrementing good quantity`,
                ['good', 'increment', 'quantity'],
                e.message
            );
        }
        return false;
    }

    /**
     * Increment a good quantity
     * @param id the id of the good
     * @param increment the amount to increment
     */
    public async incrementSingleGoodQuantity(id: number, increment: number): Promise<boolean> {
        try {
            const res = await GoodModel.incrementGoodQuantity(id, increment);
            return res ? true : false;
        } catch (e) {
            logger.error('Failed while incrementing good quantity');
        }
        return false;
    }
}

export default Service;
