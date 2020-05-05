import React from 'react';
import { connect } from 'react-redux';
import { ICart } from '@/reducers/types';
import Cart, { TMapStateToProps } from '@components/cart/Cart';
import CheckoutForm from '../forms/checkoutForm/CheckoutForm';

import './style.scss';


const mapStateToProps: TMapStateToProps = (state) => ({
  cart: {
    products: state.cart.products,
    total: state.cart.total,
  },
});


interface IProps {
  cart: ICart;
}


const Checkout: React.FC<IProps> = ({ cart }) => (
  <div className="Checkout">
    <div className="Checkout__inner">
      <Cart className="Checkout__cart" />

      <div className="Checkout__form-container">
        <CheckoutForm items={cart.products} className="Checkout__form" />
      </div>
    </div>
  </div>
);

export default connect(mapStateToProps)(Checkout);
