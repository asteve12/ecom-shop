import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import routes from '@components/routes/routes';
import { Link } from 'react-router-dom';
import Logo from '@components/ui/logo/Logo';
import Cart, { TMapStateToProps } from '@components/cart/Cart';
import BasketButton from '../ui/buttons/basketButton/BasketButton';

import './style.scss';


const mapStateToProps: TMapStateToProps = (state) => ({
  cart: {
    products: state.cart.products,
    total: state.cart.total,
  },
});


interface IProps extends ReturnType<typeof mapStateToProps> {
  children?: React.ReactNode;
  className?: string;
}


const Navigation: React.FC<IProps> = ({ className, cart }) => {
  const { products } = cart;
  const [isCartOpened, setBasketOpened] = useState<boolean>(false);

  const onBasketClick = (e: React.SyntheticEvent<HTMLButtonElement>, state: boolean): void => {
    setBasketOpened(state);
  };

  // If we click on checkout button the cart is hidden before onClick on checkout button uccurred,
  // so we need handle it with another event handler
  const hideCartOnMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && !target.closest('.Navigation__cart') && !target.closest('.BasketButton')) setBasketOpened(false);
  }, []);

  const hideCartOnCheckoutButtonClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('Navigation__checkout-button')) setBasketOpened(false);
  }, []);

  // Hide cart if the target of a click event is Checkout button or is not a cart
  useEffect(() => {
    if (isCartOpened) {
      window.addEventListener<'mousedown'>('mousedown', hideCartOnMouseDown);
      window.addEventListener<'click'>('click', hideCartOnCheckoutButtonClick);
    }

    return () => {
      window.removeEventListener<'mousedown'>('mousedown', hideCartOnMouseDown);
      window.removeEventListener<'click'>('click', hideCartOnCheckoutButtonClick);
    };
  }, [isCartOpened]);

  return (
    <nav className={`Navigation ${className || ''}`}>
      <div className="Navigation__inner">

        <Logo />

        <div className="Navigation__button-container">
          <BasketButton isActive={isCartOpened} onClick={onBasketClick} />
        </div>

        {
          isCartOpened && (
            <Cart className="Navigation__cart">
              {products.length > 0 && (
                <Link className="Navigation__checkout-button" to={`${routes.default}/checkout`}>Checkout</Link>
              )}
            </Cart>
          )
        }

      </div>
    </nav>
  );
};

export default connect(mapStateToProps)(Navigation);
