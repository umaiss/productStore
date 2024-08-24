export interface Product {
    id: string,
    name: string,
    price: number,
    description: string,
    category?: any,

}

export interface Category {
    id: string,
    name: string,
}

export interface ProductCategory {
    productId: string,
    categoryId: string
}