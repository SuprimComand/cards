import { FC, useCallback, useEffect } from 'react';
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
  const { data: priceValute, refetch } = useValutePrice(price);

  useEffect(() => {
    refetch();
  }, [update]);

  const handleClick = useCallback(() => {
    if (onSelect && !selected) {
      onSelect(product);
    }
    if (onDeleteFromCart) {
      onDeleteFromCart(product.id);
    }
  }, [onSelect, product]);

  const myLoader = ({ src }) => {
    return src;
  }

  return (
    <div className={className}>
      <div className="card">
        <Link href={`/products/${id}`}>
            <div>
                <Image width={250} height={250} loader={myLoader} src={image.replace(/.+\i\m\g/, 'https://fakestoreapi.herokuapp.com/img')} />
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
