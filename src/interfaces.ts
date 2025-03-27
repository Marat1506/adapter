

export type Empty = null | undefined;





























export interface ILbEntrie {
    score: number,
    rank: number,
    id: string,
    avatar: string,
    title: string,
    extra_data?: string
};

export interface IPurchaseData {
    productID: string,
    purchaseToken: string
};

export interface ICatalogItem {
    id: string,
    price: string,
    priceValue: number,
    title?: string,
    descr?: string
};

