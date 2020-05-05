import { IFilterResult } from '@components/contexts/filter/FilterContext';
import getValidatedPrice from './getValidatedPrice';

export type TFilterChangeHandler = (target: HTMLInputElement, filterState: IFilterResult) => IFilterResult;
export interface IFilterChanger {
  [key: string]: TFilterChangeHandler;
}

const filterChangeHandler: IFilterChanger = {
  discount: (target, filterState) => {
    const newFilter = { ...filterState };

    newFilter.discount = target.checked;

    return newFilter;
  },
  price: (target, filterState) => {
    const newFilter: IFilterResult = { ...filterState };
    const onlyDigitals: RegExp = /^\d+$/;
    const { priceType } = target.dataset;
    const newPrice: number = parseInt(target.value, 10);

    if (target.value && !target.value.match(onlyDigitals)) return newFilter;

    newFilter.price = getValidatedPrice({
      price: newPrice,
      type: priceType === 'from' ? 'from' : 'upto',
      oldPrices: newFilter.price,
    });

    return newFilter;
  },
  brands: (target, filterState) => {
    const newFilter = { ...filterState };
    newFilter.brands = [...filterState.brands];

    if (target.checked) {
      newFilter.brands.push(target.name);
    } else {
      newFilter.brands = newFilter.brands.filter((brand) => brand !== target.name);
    }

    return newFilter;
  },
  type: (target, filterState) => {
    const newFilter = { ...filterState };

    newFilter.type = {
      ...newFilter.type,
      [target.name]: target.checked,
    };

    return newFilter;
  },
};

export default filterChangeHandler;
