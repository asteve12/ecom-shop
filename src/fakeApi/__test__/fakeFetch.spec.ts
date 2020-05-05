import 'module-alias/register';
import { expect } from 'chai';

import { IFilterResult } from '@components/contexts/filter/FilterContext';
import fakeFetch, { IData } from '../fakeFetch';
import { mainItems as mainItemsStr, allItems as allItemsStr } from '../stringifiedItems';

const mainItems = JSON.parse(mainItemsStr);
const allItems = JSON.parse(allItemsStr);

describe('Main page data loading', () => {
  it('Should load data for main page', async () => {
    const result: IData = (await fakeFetch('/')).data;

    for (const item in mainItems) {
      expect(result[item]).to.not.be.a('undefined');
      expect(mainItems[item].id).equals(result[item].id);
      expect(mainItems[item].name).equals(result[item].name);
      expect(mainItems[item].description).equals(result[item].description);
      expect(mainItems[item].price).equals(result[item].price);
      expect(mainItems[item].type).equals(result[item].type);
      expect(mainItems[item].img).equals(result[item].img);
      expect(mainItems[item].discount).equals(result[item].discount);
      expect(mainItems[item].available).equals(result[item].available);
    }
  });
});

describe('Catalog page data loading', () => {
  it('Should load all items for catalog page without filter passed', async () => {
    const result: IData = (await fakeFetch('/')).data;

    for (const item in allItems) {
      expect(result[item]).to.not.be.a('undefined');

      expect(allItems[item].id).equals(result[item].id);
      expect(allItems[item].name).equals(result[item].name);
      expect(allItems[item].description).equals(result[item].description);
      expect(allItems[item].price).equals(result[item].price);
      expect(allItems[item].type).equals(result[item].type);
      expect(allItems[item].img).equals(result[item].img);
      expect(allItems[item].discount).equals(result[item].discount);
      expect(allItems[item].available).equals(result[item].available);
    }
  });

  it('Should load all items for catalog page with empty filter\'s props passed', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [0, 0],
      brands: [],
      type: {
        touchscreen: false,
        buttons: false,
      },
    };

    const result: IData = (await fakeFetch('/catalog', filter)).data;

    for (const item in allItems) {
      expect(result[item]).to.not.be.a('undefined');

      expect(allItems[item].id).equals(result[item].id);
      expect(allItems[item].name).equals(result[item].name);
      expect(allItems[item].description).equals(result[item].description);
      expect(allItems[item].price).equals(result[item].price);
      expect(allItems[item].type).equals(result[item].type);
      expect(allItems[item].img).equals(result[item].img);
      expect(allItems[item].discount).equals(result[item].discount);
      expect(allItems[item].available).equals(result[item].available);
    }
  });

  it('Should load filtered only items with discount for catalog page', async () => {
    const filter: IFilterResult = {
      discount: true,
      price: [0, 0],
      brands: [],
      type: {
        touchscreen: false,
        buttons: false,
      },
    };

    const discountedItems: any = {};

    for (const item in allItems) {
      if (allItems[item].discount) discountedItems[item] = allItems[item];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;

    for (const item in discountedItems) {
      expect(discountedItems[item].id).equals(result[item].id);
      expect(result[item].discount).equals(true);
    }
  });

  it('Should load filtered only items with price ranged from 100 upto 500 for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [100, 500],
      brands: [],
      type: {
        touchscreen: false,
        buttons: false,
      },
    };

    const pricedItems: any = {};

    for (const brand in allItems) {
      pricedItems[brand] = allItems[brand].filter((item: any) => item.price >= filter.price[0]! && item.price <= filter.price[1]!);
      if (pricedItems[brand].length < 1) delete pricedItems[brand];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in pricedItems) {
      pricedItems[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].price).lessThan(+filter.price[1]! + 1).greaterThan(+filter.price[0]! - 1);
      });
    }
  });

  it('Should load filtered only items with price ranged from 0 upto 500 for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [0, 500],
      brands: [],
      type: {
        touchscreen: false,
        buttons: false,
      },
    };

    const pricedItems: any = {};

    for (const brand in allItems) {
      pricedItems[brand] = allItems[brand].filter((item: any) => item.price >= filter.price[0]! && item.price <= filter.price[1]!);
      if (pricedItems[brand].length < 1) delete pricedItems[brand];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in pricedItems) {
      pricedItems[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].price).lessThan(+filter.price[1]! + 1).greaterThan(+filter.price[0]! - 1);
      });
    }
  });

  it('Should load filtered only items with price ranged from 500 for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [500, 0],
      brands: [],
      type: {
        touchscreen: false,
        buttons: false,
      },
    };

    const pricedItems: any = {};

    for (const brand in allItems) {
      pricedItems[brand] = allItems[brand].filter((item: any) => item.price >= filter.price[0]!);
      if (pricedItems[brand].length < 1) delete pricedItems[brand];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in pricedItems) {
      pricedItems[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].price).greaterThan(+filter.price[0]! - 1);
      });
    }
  });

  it('Should load filtered only items with buttons type for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [0, 0],
      brands: [],
      type: {
        touchscreen: false,
        buttons: true,
      },
    };

    const itemsWithButtons: any = {};

    for (const brand in allItems) {
      itemsWithButtons[brand] = allItems[brand].filter((item: any) => item.type === 'buttons');
      if (itemsWithButtons[brand].length < 1) delete itemsWithButtons[brand];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in itemsWithButtons) {
      itemsWithButtons[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].type).equals('buttons');
      });
    }
  });

  it('Should load filtered only items with touchscreen type for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [0, 0],
      brands: [],
      type: {
        touchscreen: true,
        buttons: false,
      },
    };

    const itemsWithButtons: any = {};

    for (const brand in allItems) {
      itemsWithButtons[brand] = allItems[brand].filter((item: any) => item.type === 'touchscreen');
      if (itemsWithButtons[brand].length < 1) delete itemsWithButtons[brand];
    }

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in itemsWithButtons) {
      itemsWithButtons[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].type).equals('touchscreen');
      });
    }
  });

  it('Should load filtered only items with touchscreen and buttons type for catalog page', async () => {
    const filter: IFilterResult = {
      discount: false,
      price: [0, 0],
      brands: [],
      type: {
        touchscreen: true,
        buttons: true,
      },
    };

    const result: IData = (await fakeFetch('/catalog', filter)).data;
    expect(Object.keys(result).length).greaterThan(0);

    for (const brand in allItems) {
      allItems[brand].forEach((item: any, i: number) => {
        expect(item.id).equals(result[brand][i].id);
        expect(result[brand][i].type).oneOf(['touchscreen', 'buttons']);
      });
    }
  });
});


describe('Sending payment request', () => {
  it('Should throw an Error about data required argument', async () => {
    try {
      await fakeFetch('/pay');
    } catch (error) {
      expect(error.message).equals('Data has to be provided to make a payment');
    }
  });

  it('Should get payment object', async () => {
    const result: IData = (await fakeFetch('/pay', {
      firstName: 'Firstname',
      lastName: 'Lastname',
      phone: '981237898',
      email: 'some@mail.com',
      address: 'Some street 12-3',
      cardOwner: 'ASD FDSA',
      cardNumber: '1233 4321 1234 2134',
      expiration: {
        month: '12',
        year: '12',
      },
      cvv: '123',
      items: [
        {
          id: 'someidishere',
          name: 'Samsung g20',
          price: 100,
          discount: 0,
          number: 2,
        },
        {
          id: 'hereissomeid',
          name: 'iPhone XR',
          price: 0,
          discount: 15,
          number: 4,
        },
      ],
    }));

    expect(result.status).equals(200);
    expect(result.text).equals('OK');
    expect(Object.keys(result.data).length).equals(0);
  });
});
