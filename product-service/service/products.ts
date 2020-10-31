import {Product} from "../model/Product";

const products: Product[] = [
    {
        count: 4,
        description: "Short Product Description1",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 2.4,
        title: "ProductOne",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 1"
    },
    {
        count: 6,
        description: "Short Product Description3",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
        price: 10,
        title: "ProductNew",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 2"
    },
    {
        count: 7,
        description: "Short Product Description2",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        price: 23,
        title: "ProductTop",
        imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 3"
    },
    {
        count: 12,
        description: "Short Product Description7",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
        price: 15,
        title: "ProductTitle",
        imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 4"
    },
    {
        count: 7,
        description: "Short Product Description2",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        price: 23,
        title: "Product",
        imageUrl: "https://images.unsplash.com/photo-1551029506-0807df4e2031?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 5"
    },
    {
        count: 8,
        description: "Short Product Description4",
        id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
        price: 15,
        title: "ProductTest",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 6"
    },
    {
        count: 2,
        description: "Short Product Descriptio1",
        id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
        price: 23,
        title: "Product2",
        imageUrl: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 7"
    },
    {
        count: 3,
        description: "Short Product Description7",
        id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
        price: 15,
        title: "ProductName",
        imageUrl: "https://images.unsplash.com/photo-1575709527142-a93ed587bb83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        imageTitle: "Image title 8"
    }
];

// https://www.30secondsofcode.org/js/s/is-empty
const isEmpty = val => val == null || !(Object.keys(val) || val).length;

export function getAllProductsWithDelay(ms: number): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(products);
        }, ms);
    });
}

export function getProductsByIdWithDelay(id: string, ms: number): Promise<Product[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = products.filter(product => product.id === id);
            if (isEmpty(result)) {
                reject();
            } else {
                resolve(result);
            }
        }, ms);
    });
}