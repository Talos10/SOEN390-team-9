interface OrderedGood {
    totalCost: number;
    quantity: number;
    compositeId: number;
}

interface ManufacturingOrderInterface {
    orderId: number;
    status: string;
    totalCost: number;
    startDate: Date;
    estimatedEndDate: Date;
}

interface ReturnMessage {
    status: boolean;
    message: any | any[];
    order?: any;
    missing?: any[];
}

interface ManufacturingConstructor {
    totalCost: number;
    orderedGoods: OrderedGood[];
    estimatedEndDate: Date;
}

export { ReturnMessage, OrderedGood, ManufacturingOrderInterface, ManufacturingConstructor };
