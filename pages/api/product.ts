export interface ProductType {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export class ProductApi {
    static URL = 'https://fakestoreapi.com';
    static HEROKU_URL = 'https://fakestoreapi.herokuapp.com';

    static getAllProducts = async (limit?: number)=> {
        return await fetch(`${ProductApi.HEROKU_URL}/products?limit=${limit || 100}`);
    }

    static getProductById = async (id: string | number) => {
        return await fetch(`${ProductApi.HEROKU_URL}/products/${id}`);
    }

    static createProduct = async (data: ProductType) => {
        return await fetch(`${ProductApi.HEROKU_URL}/products`, {
            method:"POST",
            body:JSON.stringify(data)
        });
    }
}