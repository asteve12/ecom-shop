import React, { useState, useEffect, useContext, useRef } from 'react';
import { TMappedDispatch } from '@components/app/App';
import { IProduct } from '@/reducers/types';
import Card from '@components/card/Card';
import fakeFetch, { IProductsRes } from '@/fakeApi/fakeFetch';
import Spinner from '../ui/loaders/Spinner/Spinner';
import { FilterContext } from '../contexts/filter/FilterContext';

import './style.scss';


interface IProps extends TMappedDispatch {
  children?: React.ReactNode;
}

const Main: React.FC<IProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<IProductsRes>({});
  const [loading, setLoading] = useState<boolean>(false);
  const productsToRender: IProduct[] = [];
  const { filterData, resetFilter } = useContext(FilterContext);
  const loadingFilterPermitted = useRef(false);

  useEffect(() => {
    resetFilter();

    setLoading(true);
    fakeFetch<IProductsRes>('/')
      .then((res) => {
        const { data } = res;
        setProducts(data);
        setLoading(false);
      })
      .finally(() => { loadingFilterPermitted.current = true; });
  }, []);

  useEffect(() => {
    if (loadingFilterPermitted.current === true) {
      setLoading(true);
      fakeFetch<IProductsRes>('/catalog', filterData).then((res) => {
        const { data } = res;
        setProducts(data);
        setLoading(false);
      });
    }
  }, [filterData]);


  for (const name in products) {
    if (products[name]) products[name].forEach((prod) => productsToRender.push(prod));
  }

  productsToRender.sort((item: IProduct) => (item.available ? -1 : 1));

  return (
    <div className="Main">
      {loading
        ? <Spinner className="Main__spinner-container" spinnerClassName="Main__spinner" />
        : productsToRender.map((prod) => (
          <Card
            className="Main__card"
            key={prod.id}
            id={prod.id}
            name={prod.name}
            price={prod.price}
            type={prod.type}
            discount={prod.discount}
            description={prod.description}
            available={prod.available}
            imgSrc={prod.img}
            addToCart={addToCart}
          />
        ))}
    </div>
  );
};

export default Main;
