import '../styles/Home.module.scss';
import ReactLoading from 'react-loading';
import Drawer from 'react-drag-drawer';
import { useQueryProducts } from '../hooks/useQueryProducts';
import Image from 'next/image';
import Header from '../components/Header';
import { useCallback, useEffect, useState } from 'react';
import { ProductApi, ProductType } from './api/product';
import ProductCard from '../components/ProductCard';

const LOAD_LIMIT = 10;

export default function Home() {
  const [limit, setLimit] = useState(10);
  const { data: products, loading, refetch } = useQueryProducts(limit);
  const [isOpenModal, setOpenModal] = useState(false);
  const [price, setPrice] = useState(0);
  const [productsCart, setProductsCart] = useState<ProductType[]>([]);
  const [activeValute, setActiveValute] = useState('');

  const handleChangeValute = useCallback((id: string) => {
    setActiveValute(id);
  }, []);

  const getProductsCart = useCallback(() => {
    const products = localStorage.getItem('productsCart');
    if (products) {
      setProductsCart(JSON.parse(products));
    }
  }, []);

  useEffect(() => {
    getProductsCart();
  }, [getProductsCart]);

  const handleAddToCart = useCallback((product: ProductType) => {
    const products = localStorage.getItem('productsCart');
    if (products) {
      const prods = JSON.parse(products);
      localStorage.setItem('productsCart', JSON.stringify([...prods, product]));
      getProductsCart();
    } else {
      localStorage.setItem('productsCart', JSON.stringify([product]));
      getProductsCart();
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleChangePrice = useCallback((e) => {
    const value = Number(e.target.value);
    if (value || e.target.value === '') {
      setPrice(value);
    }
  }, []);

  const handleClickMore = useCallback(() => {
    setLimit(limit + LOAD_LIMIT);
    refetch(limit + LOAD_LIMIT);
  }, [limit, setLimit]);

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center h-100 align-items-center">
          <ReactLoading type="spin" color="tomato" width={50} height={50} />
        </div>
      );
    }

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
          let selected = false;
          if (productsCart) {
            selected = Boolean(
              productsCart.find((item) => item.id === product.id),
            );
          }

          return (
            <ProductCard
              update={activeValute}
              onSelect={handleAddToCart}
              className="ml-2 mr-2 mb-3"
              key={product.id}
              selected={selected}
              product={product}
            />
          );
        })}
      </div>
    );
  }, [products, loading, productsCart, activeValute]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {} as ProductType;
      for (const [name, value] of formData) {
        data[name] = value;
      }
      await ProductApi.createProduct({ ...data, price });
      setOpenModal(false);
      refetch();
    },
    [price, limit],
  );

  const hideLoadMore = products.length < limit;

  return (
    <div className="container page">
      <Header
        onClickNewProduct={handleOpenModal}
        onChangeValute={handleChangeValute}
        productsCart={productsCart}
      />
      {renderContent()}
      {!hideLoadMore && (
        <div className="d-flex mt-2 justify-content-center mb-3">
          <button className="button primary" onClick={handleClickMore}>
            Load more
          </button>
        </div>
      )}
      <Drawer open={isOpenModal} onRequestClose={handleCloseModal}>
        <div className="modal">
          <h3 className="text-center mt-0 mb-1">Create new product</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-field mb-3">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" placeholder="Title" />
            </div>
            <div className="form-field mb-3">
              <label htmlFor="price">Price</label>
              <input
                value={price}
                onChange={handleChangePrice}
                name="price"
                id="price"
                placeholder="Price"
              />
            </div>
            <div className="form-field mb-3">
              <label htmlFor="image">Image(url)</label>
              <input name="image" id="image" placeholder="URL" />
            </div>
            <div className="form-field mb-3">
              <label htmlFor="category">Category</label>
              <input name="category" id="category" placeholder="Category" />
            </div>
            <div className="form-field mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                rows={5}
                placeholder="Description"
              />
            </div>
            <div>
              <button type="submit" className="button primary mr-1">
                Send
              </button>
              <button type="reset" className="button danger">
                Reset
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
