import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { TState, TProductInCart } from '@/reducers/types';

import Navigation from '@components/navigation/Navigation';
import MainSection from '@components/mainSection/MainSection';

import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  IAddToCartAction,
  IRemoveFromCartAction,
  IChangeProductNumberAction,
} from '@/actions/cartActions';

import FilterContextProvider from '@components/contexts/filter/FilterContext';

import './style.scss';


const mapDispatchToProps: TMapDispatchToProps = (dispatch) => ({
  addToCart: (item) => dispatch(addToCartAction(item)),
  removeFromCart: (id) => dispatch(removeFromCartAction(id)),
});


export type TMappedDispatch = {
  addToCart: TAddToCart,
  removeFromCart: TRemoveFromCart,
  changeProductNumber?: TChangeProductNumber,
};

export type TMapDispatchToProps = (dispatch: ThunkDispatch<TState, undefined, IAddToCartAction | IRemoveFromCartAction | IChangeProductNumberAction>) => TMappedDispatch;
export type TAddToCart = (item: TProductInCart) => void;
export type TRemoveFromCart = (id: string) => void;
export type TChangeProductNumber = (item: TProductInCart) => void;

interface IProps extends ReturnType<typeof mapDispatchToProps> { }


const App: React.FC<IProps> = ({ addToCart, removeFromCart }) => (
  <div className="App">
    <Navigation />

    <div className="App__inner">
      <FilterContextProvider>
        <MainSection
          className="App__main-section"
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </FilterContextProvider>
    </div>
  </div>
);


export default connect(null, mapDispatchToProps)(App);
