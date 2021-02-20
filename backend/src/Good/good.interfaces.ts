interface Property {
    name: string;
    value: string;
}

interface Component {
    id: number;
    quantity: number;
}

interface GoodInterface {
    name: string;
    type: string;
    quantity: number;
    processTime: number;
    cost: number;
    properties?: Property[];
    components?: Component[];
}

interface RawGoodInterface extends GoodInterface {
    vendor: string;
}

interface SemiGoodInterface extends GoodInterface {}

interface FinishedGoodInterface extends GoodInterface {
    price: number;
}

interface ReturnMessage {
    status: boolean;
    message: any | any[];
    good?: any;
}

type AnyGood = RawGoodInterface | GoodInterface | SemiGoodInterface | FinishedGoodInterface;

export {
    AnyGood,
    ReturnMessage,
    Property,
    Component,
    GoodInterface,
    RawGoodInterface,
    SemiGoodInterface,
    FinishedGoodInterface
};
