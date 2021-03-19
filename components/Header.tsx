import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductType } from '../pages/api/product';
import { Course, ValuteType } from '../pages/api/course';

interface HeaderProps {
  onClickNewProduct?: () => void;
  onGoBack?: () => void;
  productsCart?: ProductType[];
  onChangeValute?: (id: string) => void;
}

const Header: FC<HeaderProps> = ({
  onClickNewProduct,
  onGoBack,
  productsCart,
  onChangeValute,
}) => {
  const [products, setProducts] = useState<ProductType[]>(productsCart || []);
  const [valute, setValute] = useState<ValuteType[]>([]);
  const [activeValute, setActiveValute] = useState<ValuteType['ID'] | null>(
    null,
  );

  const getActiveValute = useCallback(() => {
    const valute = localStorage.getItem('valute');
    setActiveValute(valute || null);
  }, []);

  useEffect(() => {
    getActiveValute();
  }, []);

  const handleSelectValute = useCallback(
    (valute: ChangeEvent<HTMLSelectElement>) => {
      localStorage.setItem('valute', valute.target.value);
      getActiveValute();
      if (onChangeValute) {
        onChangeValute(valute.target.value);
      }
    },
    [onChangeValute],
  );

  useEffect(() => {
    Course.getCourses()
      .then((response) => response.json())
      .then((result) => setValute(Object.values(result.Valute)));
  }, []);

  useEffect(() => {
    if (!productsCart) {
      const products = localStorage.getItem('productsCart');
      if (products) {
        setProducts(JSON.parse(products));
      }
    } else {
      setProducts(productsCart);
    }
  }, [productsCart]);

  return (
    <header className="header">
      <div>
        {onClickNewProduct && (
          <button onClick={onClickNewProduct} className="button primary">
            New product
          </button>
        )}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="button transparent d-flex align-items-center">
            <Image width={16} height={16} src="/assets/arrow-left.png" />{' '}
            <b className="ml-1">back</b>
          </button>
        )}
      </div>
      <div className="d-flex align-items-center">
        <select onChange={handleSelectValute} className="valute-select">
          {valute.map((item) => (
            <option
              selected={activeValute === item.ID}
              key={item.ID}
              value={item.ID}>
              {item.CharCode}
            </option>
          ))}
        </select>
        <Link href="/cart">
          <button className="button transparent d-flex align-items-center">
            <Image width={25} height={25} src="/assets/cart.png" />
            <b className="ml-1 cart-size">{products.length}</b>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
