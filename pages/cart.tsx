import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '../components/Header';
import { ProductType } from './api/product';
import ProductCard from '../components/ProductCard';
import { ValuteType } from './api/course';

export default function Cart() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [activeValute, setActiveValute] = useState('');

  const handleChangeValute = useCallback((id: string) => {
    setActiveValute(id);
  }, []);

  const getProducts = useCallback(() => {
    const products = localStorage.getItem('productsCart');
    if (products) {
      setProducts(JSON.parse(products));
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  const handleDeleteFromCart = useCallback((id: string | number) => {
    const products = localStorage.getItem('productsCart');
    if (products) {
      const newProducts = JSON.parse(products).filter((item) => item.id !== id);
      localStorage.setItem('productsCart', JSON.stringify(newProducts));
      setProducts(newProducts);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderContent = useCallback(() => {
    if (!products.length) {
      return (
        <div className="d-flex justify-content-center h-100 align-items-center">
          <Image width={250} height={200} src="/assets/page-broken.png" />
        </div>
      );
    }

    return (
      <div className="d-flex ml-3 mr-3 flex-wrap mt-3">
        {products.map((product) => {
          return (
            <ProductCard
              update={activeValute}
              onDeleteFromCart={handleDeleteFromCart}
              className="ml-2 mr-2 mb-3"
              key={product.id}
              product={product}
            />
          );
        })}
      </div>
    );
  }, [products, activeValute]);

  return (
    <div className="container page">
      <Header
        onChangeValute={handleChangeValute}
        productsCart={products}
        onGoBack={handleGoBack}
      />
      {renderContent()}
    </div>
  );
}
