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

export {
    Property,
    Component,
    GoodInterface,
    RawGoodInterface,
    SemiGoodInterface,
    FinishedGoodInterface
};
