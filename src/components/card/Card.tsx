import React from 'react';
import { TAddToCart } from '@components/app/App';
import SimpleButton from '@components/ui/buttons/simpleButton/SimpleButton';
import { getDiscountMultiplier } from '@/reducers/rootReducer';

import './style.scss';


interface IProps {
  id: string;
  addToCart: TAddToCart;
  name?: string;
  discount: number;
  price: number;
  className?: string;
  description?: string;
  type?: string;
  imgSrc?: string;
  available?: boolean;
}


const Card: React.FC<IProps> = (props) => {
  const {
    id,
    addToCart,
    name,
    className,
    description,
    price = 0,
    type = '',
    imgSrc = '',
    discount,
    available = true,
  } = props;
  const discountedPrice: number = discount > 0 ? Math.round(price * getDiscountMultiplier(discount)) : 0;

  const add: React.EventHandler<React.SyntheticEvent<HTMLButtonElement>> = () => {
    addToCart({
      name: name || '',
      id,
      price,
      discount,
      number: 1,
    });
  };

  return (
    <div className={`Card ${className || ''}`}>
      <div className="Card__img-container">
        <img src={imgSrc} alt="" className="Card__img" />
      </div>

      <div className="Card__description-container">
        <h2 className="Card__name">{name}</h2>
        <p className="Card__description">{description}</p>
        <p className="Card__description">Type: {type}</p>
      </div>

      <div className="Card__price-container">
        <span className={`Card__price ${discountedPrice > 0 ? 'Card__price_discounted' : ''}`}>${price}</span>
        {
          discountedPrice > 0 && <span className="Card__price Card__price_with-discount">${discountedPrice}</span>
        }

        <div className="Card__button-container">
          <SimpleButton className="Card__button" value={available ? 'Add' : 'Sold'} onClick={add} disabled={!available} />
        </div>
      </div>
    </div>
  );
};

export default Card;
