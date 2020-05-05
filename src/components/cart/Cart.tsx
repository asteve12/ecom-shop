import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { removeFromCart as removeFromCartAction, changeProductNumber as changeProductNumberAction, IRemoveFromCartAction, IChangeProductNumberAction } from '@/actions/cartActions';
import { TRemoveFromCart, TChangeProductNumber } from '@components/app/App';
import { TState, ICart } from '@/reducers/types';
import ListItem from '../listItem/ListItem';
import ItemInCart, { TSetNumber } from './itemInCart/ItemInCart';

import './style.scss';


const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  removeFromCart: (id) => dispatch(removeFromCartAction(id)),
  changeProductNumber: (item) => dispatch(changeProductNumberAction(item)),
});

const mapStateToProps: TMapStateToProps = (state) => ({
  cart: {
    products: state.cart.products,
    total: state.cart.total,
  },
});


export type TMappedDispatch = { removeFromCart: TRemoveFromCart, changeProductNumber: TChangeProductNumber };
export type TMapDispatchToProps = (dispatch: ThunkDispatch<TState, undefined, IRemoveFromCartAction | IChangeProductNumberAction>) => TMappedDispatch;
export type IItemsInCart = { [key: string]: TProductInCart };
export type TCartToProps = { cart: ICart };
export type TMapStateToProps = (state: TState) => TCartToProps;
export type TProductInCart = {
  id: string;
  name: string;
  number: number;
};
interface IProps extends ReturnType<typeof mapDispatchToProps> {
  cart: ICart;
  className?: string;
  children?: React.ReactNode;
}


const Cart: React.FC<IProps> = ({ className = '', children, cart, removeFromCart, changeProductNumber }) => {
  const { products, total } = cart;
  const setNumber: TSetNumber = (id, number) => {
    const prodToDispatch = cart.products.find((item) => item.id === id);
    changeProductNumber!({ ...prodToDispatch!, number });
  };

  return (
    <ul className={`Cart ${className}`}>
      {
        products.length <= 0
          ? (
            <ListItem className="Cart__list-item-empty">
              <span className="Cart__empty">Cart empty</span>
            </ListItem>
          )
          : products.map((prod) => (
            <ListItem key={prod.id}>
              <ItemInCart
                removeFromCart={removeFromCart}
                updateNumber={setNumber}
                prod={prod}
                className="Cart__item-in-cart"
              />
            </ListItem>
          ))
      }
      {
        products.length > 0 && (
          <p className="Cart__total">
            Total: <span className="Cart__total-sum">${total}</span>
          </p>
        )
      }
      {children}
    </ul>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
