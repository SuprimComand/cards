import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactLoading from 'react-loading';
import Image from 'next/image'
import { useQueryProduct } from '../../hooks/useQueryProduct';
import Header from '../../components/Header';
import { useValutePrice } from '../../hooks/useValutePrice';

export default function Product() {
  const router = useRouter();
  const { data: product, loading } = useQueryProduct(Number(router.query.id));
  const [showDefaultImage, setShowDefaultImage] = useState(false);
  const { data: priceValute, refetch } = useValutePrice(product?.price);

  const handleChangeValute = useCallback(() => {
    refetch(product?.price);
  }, [product]);

  useEffect(() => {
    if (product) {
      refetch(product.price);
    }
  }, [product]);

  const handleError = useCallback(() => {
      setShowDefaultImage(true);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center h-100 align-items-center">
          <ReactLoading type="spin" color="tomato" width={50} height={50} />
        </div>
      );
    }
    
    if (!product) {
      return (
        <div className="d-flex justify-content-center h-100 align-items-center">
          <Image width={250} height={200} src="/assets/page-broken.png" />
        </div>
      )
    }

    return (
      <div className="d-flex product justify-content-between mr-3 ml-3 mt-3">
        <div className="product-column--left">
          {!showDefaultImage ? <img onError={handleError} src={product.image} className="product-image" /> : (
            <Image width={250} height={250} className="product-image" src={'/assets/default-picture.png'} />
          )}
        </div>
        <div className="ml-3 product-column--right flex">
          <h1 className="mt-0 mb-2 product-title">{product.title}</h1>
          <div className="d-flex">
            <span className="card-label">Category: </span>
            <b className="card-value ml-3">{product.category}</b>
          </div>
          <div className="d-flex">
            <span className="card-label">Price: </span>
            <b className="card-value ml-3">{priceValute}</b>
          </div>
          <p>{product.description}</p>
        </div>
      </div>
    );
  }, [product, loading, showDefaultImage, priceValute]);

  return (
    <div className="container page">
      <Header onChangeValute={handleChangeValute} onGoBack={handleGoBack} />
      {renderContent()}
    </div>
  )
}
