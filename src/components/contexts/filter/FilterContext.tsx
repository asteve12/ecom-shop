import React, { createContext, useState } from 'react';


export type TFilterPrice = number | '' | undefined;
export type TFilterPrices = [TFilterPrice, TFilterPrice];
export interface IFilterResult {
  discount: boolean;
  price: TFilterPrices;
  brands: string[];
  type: {
    touchscreen: boolean,
    buttons: boolean,
  };
}

export type TUpdateFilter = React.Dispatch<React.SetStateAction<IFilterResult>>;
export type TResetFilter = Function;
export interface IContextValue {
  filterData: IFilterResult,
  defaultFilterData: IFilterResult,
  updateFilter: TUpdateFilter,
  resetFilter: TResetFilter,
}

interface IProps {
  children?: React.ReactNode;
}


const defaultFilterData: IFilterResult = {
  discount: false,
  price: ['', ''],
  brands: [],
  type: {
    touchscreen: false,
    buttons: false,
  },
};

const defaultContextValue: IContextValue = {
  filterData: defaultFilterData,
  defaultFilterData,
  updateFilter: () => {},
  resetFilter: () => {},
};

export const FilterContext = createContext<IContextValue>(defaultContextValue);

const FilterContextProvider: React.FC<IProps> = (props) => {
  const { children } = props;

  const [filterResult, setFilterResult] = useState<IFilterResult>({
    discount: false,
    price: ['', ''],
    brands: [],
    type: {
      touchscreen: false,
      buttons: false,
    },
  });

  const resetFilter: TResetFilter = () => setFilterResult(defaultFilterData);

  return (
    <FilterContext.Provider
      value={{
        filterData: filterResult,
        defaultFilterData,
        updateFilter: setFilterResult,
        resetFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
