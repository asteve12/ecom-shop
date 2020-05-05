import 'module-alias/register';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import { allItems as allItemsStr } from '../../fakeApi/stringifiedItems';
import { cartTypes } from '../../actions/actionTypes';
import rootReducer, { getDiscountMultiplier } from '../rootReducer';


const allItems = JSON.parse(allItemsStr);

describe('Test ADD_TO_CART action dispatching', () => {
  it('Should add product to the cart and update "total" prop', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];

    const productToAddS = {
      id: samsungGalaxyS20.id,
      name: samsungGalaxyS20.name,
      price: samsungGalaxyS20.price,
      discount: samsungGalaxyS20.discount,
      number: 1,
    };

    const action = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddS,
    };

    const stateToCompare = {
      cart: {
        products: [productToAddS],
        total: productToAddS.price,
      },
    };

    store.subscribe(() => {
      const updatedState = store.getState();
      updatedState.cart.products.forEach((el, i) => {
        let prop = Object.keys(el)[0];

        for (prop in el) {
          expect(el[prop]).equals(stateToCompare.cart.products[i][prop]);
        }
      });
      expect(updatedState.cart.total).equals(stateToCompare.cart.total);
    });
    store.dispatch(action);
  });

  it('Should add 2 products (1 with discount) to the cart and update "total" prop', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];
    const xiaomiMiMix2S = allItems.Xiaomi[3];

    const productToAddS = {
      id: samsungGalaxyS20.id,
      name: samsungGalaxyS20.name,
      price: samsungGalaxyS20.price,
      discount: samsungGalaxyS20.discount,
      number: 1,
    };
    const productToAddX = {
      id: xiaomiMiMix2S.id,
      name: xiaomiMiMix2S.name,
      price: xiaomiMiMix2S.price,
      discount: xiaomiMiMix2S.discount,
      number: 1,
    };

    const action = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddS,
    };
    const total = productToAddS.price + Math.round((productToAddX.price * getDiscountMultiplier(productToAddX.discount)));

    const stateToCompare = {
      cart: {
        products: [productToAddS, productToAddX],
        total,
      },
    };

    store.dispatch(action);

    store.subscribe(() => {
      const updatedState = store.getState();
      updatedState.cart.products.forEach((el, i) => {
        let prop = Object.keys(el)[0];
        for (prop in el) {
          expect(el[prop]).equals(stateToCompare.cart.products[i][prop]);
        }
      });
      expect(updatedState.cart.total).equals(stateToCompare.cart.total);
    });

    const actionWithDiscountedProduct = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddX,
    };
    store.dispatch(actionWithDiscountedProduct);
  });
});

describe('Test REMOVE_FROM_CART action dispatching', () => {
  it('Should remove product from the cart and update "total" prop. A cart has to be empty', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];

    const action = {
      type: cartTypes.REMOVE_FROM_CART,
      data: samsungGalaxyS20.id,
    };

    store.subscribe(() => {
      const updatedState = store.getState();

      expect(updatedState.cart.products.length).equals(0);
      expect(updatedState.cart.total).equals(0);
    });
    store.dispatch(action);
  });

  it('Should remove product with discount from the cart and update "total" prop', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];
    const xiaomiMiMix2S = allItems.Xiaomi[3];

    const productToAddS = {
      id: samsungGalaxyS20.id,
      name: samsungGalaxyS20.name,
      price: samsungGalaxyS20.price,
      discount: samsungGalaxyS20.discount,
      number: 1,
    };
    const productToAddX = {
      id: xiaomiMiMix2S.id,
      name: xiaomiMiMix2S.name,
      price: xiaomiMiMix2S.price,
      discount: xiaomiMiMix2S.discount,
      number: 1,
    };

    const actionOne = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddS,
    };
    const actionTwo = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddX,
    };

    const stateToCompare = {
      cart: {
        products: [productToAddS],
        total: productToAddS.price,
      },
    };

    store.dispatch(actionOne);
    store.dispatch(actionTwo);

    store.subscribe(() => {
      const updatedState = store.getState();

      expect(updatedState.cart.products.length).equals(1);
      expect(updatedState.cart.products[0].id).equals(productToAddS.id);
      expect(updatedState.cart.total).equals(stateToCompare.cart.total);
    });

    const actionWithDiscountedProduct = {
      type: cartTypes.REMOVE_FROM_CART,
      data: productToAddX.id,
    };
    store.dispatch(actionWithDiscountedProduct);
  });
});

describe('Test CHANGE_PRODUCT_NUMBER', () => {
  it('Should update product number and update "total" prop', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];

    const productToAddS = {
      id: samsungGalaxyS20.id,
      name: samsungGalaxyS20.name,
      price: samsungGalaxyS20.price,
      discount: samsungGalaxyS20.discount,
      number: 1,
    };

    const firstAction = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddS,
    };
    const secondAction = {
      type: cartTypes.CHANGE_PRODUCT_NUMBER,
      data: {
        ...productToAddS,
        number: 5,
      },
    };

    const stateToCompare = {
      cart: {
        products: [{ ...productToAddS, number: 5 }],
        total: (productToAddS.price * 5),
      },
    };

    store.dispatch(firstAction);

    store.subscribe(() => {
      const updatedState = store.getState();
      updatedState.cart.products.forEach((el, i) => {
        for (const prop in el) {
          expect(el[prop]).equals(stateToCompare.cart.products[i][prop]);
        }
      });
      expect(updatedState.cart.total).equals(stateToCompare.cart.total);
    });
    store.dispatch(secondAction);
  });

  it('Should remove product from a cart if it\'s number less than 0 and it has 0 items in the cart. And update "total" prop', () => {
    const composeEnhancers = compose(applyMiddleware(thunk));
    const store = createStore(rootReducer, composeEnhancers);
    const samsungGalaxyS20 = allItems.Samsung[0];

    const productToAddS = {
      id: samsungGalaxyS20.id,
      name: samsungGalaxyS20.name,
      price: samsungGalaxyS20.price,
      discount: samsungGalaxyS20.discount,
      number: 1,
    };

    const firstAction = {
      type: cartTypes.ADD_TO_CART,
      data: productToAddS,
    };
    const secondAction = {
      type: cartTypes.CHANGE_PRODUCT_NUMBER,
      data: {
        ...productToAddS,
        number: 0,
      },
    };
    const finalAction = {
      type: cartTypes.CHANGE_PRODUCT_NUMBER,
      data: {
        ...productToAddS,
        number: -1,
      },
    };

    const stateToCompare = {
      cart: {
        products: [],
        total: 0,
      },
    };

    store.dispatch(firstAction);
    store.dispatch(secondAction);

    store.subscribe(() => {
      const updatedState = store.getState();
      updatedState.cart.products.forEach((el, i) => {
        for (const prop in el) {
          expect(el[prop]).equals(stateToCompare.cart.products[i][prop]);
        }
      });
      expect(updatedState.cart.total).equals(stateToCompare.cart.total);
    });
    store.dispatch(finalAction);
  });
});
