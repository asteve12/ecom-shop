import { TCartTypes, TPaymentTypes } from '@/actions/actionTypes';
import { Reducer, Action } from 'redux';

export type TState = {
  cart: ICart;
};

export type TAction = Action<keyof TCartTypes | keyof TPaymentTypes> & {
  data: any;
};

export type TRootReducer = Reducer<TState, TAction>;

export interface ICart {
  products: TProductInCart[];
  total: number;
}

export type TProductInCart = {
  id: string,
  name: string,
  price: number,
  discount: number,
  number: number,
};

export interface IProduct {
  name: string;
  id: string;
  price: number;
  discount: number;
  available: boolean;
  img: string;
  description: string;
  type?: string;
}
