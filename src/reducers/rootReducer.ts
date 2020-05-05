
import { cartTypes, paymentTypes } from '@/actions/actionTypes';
import { TRootReducer, TState, TProductInCart, ICart } from './types';


export const getDiscountMultiplier: (discount: number) => number = (discount) => ((100 - discount) / 100);

const emptyCart: ICart = {
  products: [],
  total: 0,
};

const cartFromLocalStorage = localStorage ? localStorage.getItem('cart') : null;
const parsedCartFromLocalStorage: ICart = cartFromLocalStorage ? JSON.parse(cartFromLocalStorage) : emptyCart;
const initialState: TState = {
  cart: parsedCartFromLocalStorage,
};


const rootReducer: TRootReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case cartTypes.ADD_TO_CART: {
      let newProducts: TProductInCart[] = [];

      const { products, total } = state.cart;
      const discountMultiplier = getDiscountMultiplier(data.discount);
      const priceWithDiscount: number = Math.round(data.price * discountMultiplier);

      const productInCart = products.find((item) => data.id === item.id);
      const productToAdd = productInCart ? { ...productInCart, number: productInCart.number + 1 } : data;

      if (productInCart) {
        newProducts = products.map((item) => (item.id === data.id
          ? productToAdd
          : item
        ));
      } else {
        newProducts = [...products, productToAdd];
      }

      const newState = {
        ...state,
        cart: {
          products: newProducts,
          total: total + priceWithDiscount,
        },
      };

      if (localStorage) localStorage.setItem('cart', JSON.stringify(newState.cart));

      return newState;
    }

    case cartTypes.CHANGE_PRODUCT_NUMBER: {
      let newProducts: TProductInCart[] = [];
      let newTotal: number = state.cart.total;

      const { products, total } = state.cart;
      const discountMultiplier = getDiscountMultiplier(data.discount);

      const productInCart = products.find((item) => data.id === item.id);
      const productToChange = productInCart ? { ...productInCart, number: data.number } : data;

      const priceWithDiscount: number = Math.round(data.price * discountMultiplier) * productInCart!.number;
      const newPriceWithDiscount: number = Math.round(data.price * discountMultiplier) * data.number;

      if (data.number < 0) {
        newProducts = products.filter((item) => item.id !== data.id);
      } else {
        newProducts = products.map((item) => (item.id !== data.id
          ? item
          : productToChange
        ));
        newTotal = total - priceWithDiscount + newPriceWithDiscount;
      }

      const newState = {
        ...state,
        cart: {
          products: newProducts,
          total: newTotal,
        },
      };

      if (localStorage) localStorage.setItem('cart', JSON.stringify(newState.cart));

      return newState;
    }

    case cartTypes.REMOVE_FROM_CART: {
      let newProducts: TProductInCart[] = [];

      const { products, total } = state.cart;
      const itemToRemove = state.cart.products.find((item) => item.id === action.data);
      const discountMultiplier = itemToRemove ? getDiscountMultiplier(itemToRemove.discount) : 1;
      const priceToDeduct = itemToRemove
        ? (Math.round(itemToRemove.price * discountMultiplier) * itemToRemove.number)
        : 0;

      newProducts = products.filter((item: TProductInCart) => item.id !== action.data);


      const newState = {
        ...state,
        cart: {
          products: newProducts,
          total: total - priceToDeduct,
        },
      };

      if (localStorage) localStorage.setItem('cart', JSON.stringify(newState.cart));

      return newState;
    }

    case paymentTypes.MAKE_PAYMENT: {
      if (localStorage) localStorage.setItem('cart', '');
      return {
        cart: {
          products: [],
          total: 0,
        },
      };
    }

    default:
      return state;
  }
};

export default rootReducer;
