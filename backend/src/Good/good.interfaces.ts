interface Property {
    name: string;
    value: string;
}

interface Component {
    id: number;
    name?: string;
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

export interface SuccessMessage<T> {
    status: true;
    message: T;
    good?: any;
}

export interface ErrorMessage {
    status: false;
    message: string;
    good?: any;
}

type AnyGood = RawGoodInterface | GoodInterface | SemiGoodInterface | FinishedGoodInterface;

type SingleGood = {
    id: number;
    schema: number;
    quality: string | null;
};

type SchemaAndGoods = {
    schema: AnyGood;
    goods: SingleGood[];
};

export {
    AnyGood,
    Property,
    Component,
    GoodInterface,
    RawGoodInterface,
    SemiGoodInterface,
    FinishedGoodInterface,
    SingleGood,
    SchemaAndGoods
};
