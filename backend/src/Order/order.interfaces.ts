interface OrderedGood {
    compositeId: number;
    totalPrice?: number;
    quantity: number;
}

interface CompleteCustomerOrder {
    orderId: number;
    customerId: number;
    status: string;
    totalPrice: number;
    creationDate: Date;
    completionDate: Date;
}

interface ReturnMessage {
    status: boolean;
    message: any | any[];
    order?: any;
    missing?: any[];
}

export { OrderedGood, CompleteCustomerOrder, ReturnMessage };
