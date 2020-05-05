import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons/faShoppingBasket';

import { TProductInCart } from '@/components/cart/Cart';
import { TState } from '../../../../reducers/types';

import './style.scss';


interface IProps {
  isActive: boolean;
  numberOfItems: number;
  className?: string;
  onClick?: (e: TButtonEvent, state: boolean) => void;
}

type TButtonEvent = React.SyntheticEvent<HTMLButtonElement>;
type IMapState = (state: TState) => { numberOfItems: number };


const mapStateToProps: IMapState = (state) => ({
  numberOfItems: state.cart.products.map((item: TProductInCart): number => item.number).reduce((prev, cur) => prev + cur, 0),
});


const BasketButton: React.FC<IProps> = ({ className, numberOfItems, onClick, isActive }) => {
  const buttonAction: React.EventHandler<TButtonEvent> = (e: TButtonEvent) => {
    if (onClick) onClick(e, !isActive);
  };

  return (
    <button onClick={buttonAction} type="button" className={`BasketButton ${isActive ? 'BasketButton_active' : ''} ${className || ''}`}>
      <div className="BasketButton__inner">
        <div className="BasketButton__icon-container">
          <FontAwesomeIcon icon={faShoppingBasket} />
          <span className="BasketButton__item-counter">{numberOfItems}</span>
        </div>
      </div>
    </button>
  );
};

export default connect(mapStateToProps)(BasketButton);
