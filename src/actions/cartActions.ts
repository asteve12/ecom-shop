import { Dispatch } from 'redux';
import { TState, TProductInCart } from '@/reducers/types';
import fakeFetch, { IRes, IPaymentData, IData } from '@/fakeApi/fakeFetch';
import { cartTypes, paymentTypes } from './actionTypes';

export type TAddToCart = (product: TProductInCart) => (dispatch: Dispatch<IAddToCartAction>) => void;
export interface IAddToCartAction {
  type: 'ADD_TO_CART';
  data: TProductInCart;
}
export const addToCart: TAddToCart = (product) => (dispatch) => {
  const data: TProductInCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    number: product.number,
  };

  dispatch({ type: cartTypes.ADD_TO_CART, data });
};

export type TChangeProductNumber = (product: TProductInCart) => (dispatch: Dispatch<IChangeProductNumberAction>) => void;
export interface IChangeProductNumberAction {
  type: 'CHANGE_PRODUCT_NUMBER';
  data: TProductInCart;
}
export const changeProductNumber: TChangeProductNumber = (product) => (dispatch) => {
  const data: TProductInCart = {
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    number: product.number,
  };

  dispatch({ type: cartTypes.CHANGE_PRODUCT_NUMBER, data });
};


export type TRemoveFromCart = (id: string) => (dispatch: Dispatch<IRemoveFromCartAction>) => void;
export interface IRemoveFromCartAction {
  type: 'REMOVE_FROM_CART';
  data: string;
}
export const removeFromCart: TRemoveFromCart = (id) => (dispatch) => {
  dispatch({ type: cartTypes.REMOVE_FROM_CART, data: id });
};


export type TMakePayment = (paymentData: IPaymentData) => (dispatch: Dispatch<IPayAction>, getState: () => TState) => Promise<IRes<IData>>;
export interface IPayAction {
  type: 'MAKE_PAYMENT';
  data: { [key: string]: any };
}
export const makePayment: TMakePayment = (paymentData) => (dispatch, getState) => {
  const { products } = getState().cart;

  if (products.length <= 0) return Promise.reject(new Error('Cart is empty'));

  return fakeFetch('/pay', paymentData)
    .then((res: IRes<IData>) => new Promise<IRes<IData>>((resolve) => {
      dispatch({ type: paymentTypes.MAKE_PAYMENT, data: res.data });
      resolve(res);
    }))
    .catch((err) => err);
};
