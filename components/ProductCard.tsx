import { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductType } from '../pages/api/product';
import '../styles/Home.module.scss';
import { useValutePrice } from '../hooks/useValutePrice';

interface ProductProps {
  className?: string;
  selected?: boolean;
  update?: string | number | boolean;
  onSelect?: (product: ProductType) => void;
  product: ProductType;
  onDeleteFromCart?: (id: string | number) => void;
}

const ProductCard: FC<ProductProps> = ({
  className,
  onDeleteFromCart,
  onSelect,
  product,
  selected,
  update,
}) => {
  const { title, id, image, category, price, description } = product;
  const [showDefaultImage, setShowDefaultImage] = useState(false);
  const { data: priceValute, refetch } = useValutePrice(price);

  useEffect(() => {
    refetch();
  }, [update]);

  const handleError = useCallback(() => {
    setShowDefaultImage(true);
  }, []);

  const handleClick = useCallback(() => {
    if (onSelect && !selected) {
      onSelect(product);
    }
    if (onDeleteFromCart) {
      onDeleteFromCart(product.id);
    }
  }, [onSelect, product]);

  return (
    <div className={className}>
      <div className="card">
        <Link href={`/products/${id}`}>
            <div>
                {!showDefaultImage && image ? (
                <img onError={handleError} src={image} className="card-image" />
                ) : (
                <Image width={250} height={200} src={'/assets/default-picture.png'} />
                )}
                <h4 className="mt-1 mb-2 card-title">{title}</h4>
                <div className="d-flex justify-content-between">
                <span className="card-label">Category: </span>
                <b className="card-value">{category}</b>
                </div>
                <div className="d-flex justify-content-between mb-2">
                <span className="card-label">Price: </span>
                <b className="card-value">{priceValute}</b>
                </div>
                <p className="mb-0 card-description">{description}</p>
            </div>
        </Link>
        <div className="justify-content-end d-flex">
          {onSelect ? (
            <button
              onClick={handleClick}
              className={`button ${selected ? 'default' : 'success'} mt-2`}>
              {selected ? 'Added to cart' : 'Add to cart'}
            </button>
          ) : (
            <button onClick={handleClick} className="button danger mt-2">
              Delete from cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
