import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import Checkbox from '@components/ui/inputs/checkbox/Checkbox';
import Rollup from '@components/ui/rollup/Rollup';
import TextInput from '@components/ui/inputs/text/TextInput';

import { FilterContext, IFilterResult, IContextValue } from '@components/contexts/filter/FilterContext';
import { IRelatedElement } from '@components/ui/buttons/showButton/ShowButton';
import ShowButton from '../ui/buttons/showButton/ShowButton';
import SimpleButton from '../ui/buttons/simpleButton/SimpleButton';
import ModalBg from '../modalBg/ModalBg';
import CloseButton from '../ui/buttons/closeButton/CloseButton';

import filterChangeHandler from './utils/filterChangeHandler';

import './style.scss';


interface IProps {
  showSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  isSideBarActiveOnMediumScreen: boolean;
  className?: string;
}


const SideBar: React.FC<IProps> = ({ showSideBar, isSideBarActiveOnMediumScreen, className }) => {
  const { filterData, updateFilter, resetFilter: ctxResetFilter, defaultFilterData } = useContext<IContextValue>(FilterContext);

  const [filterChanged, setFilterChanged] = useState<boolean>(false);
  const [filter, setFilter] = useState<IFilterResult>(filterData); // Filter to render in Sidebar
  const [showButtonRelatedElementData, setShowButtonRelatedElementData] = useState<IRelatedElement>({ top: 0, height: 0 });

  const sideBarRef = useRef<HTMLDivElement>(null);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const inputContainer = document.querySelector<HTMLElement>(`label[for=${target.id}]`) || target;

    setFilterChanged(true);
    setShowButtonRelatedElementData(() => {
      const inputTop = inputContainer.offsetTop;
      const inputHeight = inputContainer.offsetHeight;

      return {
        top: inputTop,
        height: inputHeight,
      };
    });

    setFilter((prevFilter) => {
      const { filterType } = target.dataset;
      const handler = filterType && filterChangeHandler[filterType];
      const newFilter = handler ? handler(target, prevFilter) : { ...prevFilter };

      return newFilter;
    });
  };

  const resetFilter: () => void = () => {
    setFilter(defaultFilterData);
    ctxResetFilter();
    setFilterChanged(false);
  };

  const hideSideBar = () => {
    showSideBar(false);
  };

  const submitFilterChange: () => void = () => {
    updateFilter(() => {
      const [priceFrom, priceUpto] = filter.price;
      const newFilter = { ...filter };

      if (!!priceUpto && !!priceFrom && priceUpto < priceFrom) {
        [newFilter.price[1], newFilter.price[0]] = [newFilter.price[0], newFilter.price[1]];
        setFilter(newFilter);
      }

      return newFilter;
    });
    setFilterChanged(false);
    hideSideBar();
  };

  useEffect(() => {
    setFilter(filterData);
  }, [filterData]);

  return (
    <>
      <aside>
        <div ref={sideBarRef} className={`SideBar SideBar_s ${className || ''}`}>
          <div className="SideBar__inner">

            <CloseButton className="SideBar__close-button" onClick={hideSideBar} />

            <div className="SideBar__checkbox-wrapper">
              <Checkbox
                data={{ 'data-filter-type': 'discount' }}
                className="SideBar__checkbox"
                text="Discount"
                name="discount"
                id="discount"
                checked={filter.discount}
                onChange={onChange}
              />
            </div>

            <Rollup className="SideBar__rollup" header="Price">
              <div className="SideBar__price-rollup">
                <div className="SideBar__price-wrapper">
                  <TextInput
                    className="App__text-input"
                    data={{ 'data-filter-type': 'price', 'data-price-type': 'from' }}
                    id="price-from"
                    placeholder="from"
                    value={filter.price[0]}
                    onChange={onChange}
                  />
                </div>
                <div className="SideBar__price-wrapper">
                  <TextInput
                    className="App__text-input"
                    data={{ 'data-filter-type': 'price', 'data-price-type': 'upto' }}
                    id="price-upto"
                    placeholder="upto"
                    value={filter.price[1]}
                    onChange={onChange}
                  />
                </div>
              </div>
            </Rollup>

            <Rollup className="SideBar__rollup" header="Brand">
              <Checkbox
                data={{ 'data-filter-type': 'brands' }}
                className="Rollup__item"
                text="Apple"
                name="Apple"
                id="apple"
                checked={filter.brands.includes('Apple')}
                onChange={onChange}
              />
              <Checkbox
                data={{ 'data-filter-type': 'brands' }}
                className="Rollup__item"
                text="FinePower"
                name="FinePower"
                id="finepower"
                checked={filter.brands.includes('FinePower')}
                onChange={onChange}
              />
              <Checkbox
                data={{ 'data-filter-type': 'brands' }}
                className="Rollup__item"
                text="Samsung"
                name="Samsung"
                id="samsung"
                checked={filter.brands.includes('Samsung')}
                onChange={onChange}
              />
              <Checkbox
                data={{ 'data-filter-type': 'brands' }}
                className="Rollup__item"
                text="Xiaomi"
                name="Xiaomi"
                id="xiaomi"
                checked={filter.brands.includes('Xiaomi')}
                onChange={onChange}
              />
            </Rollup>

            <Rollup className="SideBar__rollup" header="Type">
              <Checkbox
                data={{ 'data-filter-type': 'type' }}
                className="Rollup__item"
                text="Buttons"
                name="buttons"
                id="buttons"
                checked={filter.type.buttons}
                onChange={onChange}
              />
              <Checkbox
                data={{ 'data-filter-type': 'type' }}
                className="Rollup__item"
                text="Touch screen"
                name="touchscreen"
                id="touchscreen"
                checked={filter.type.touchscreen}
                onChange={onChange}
              />
            </Rollup>

            <SimpleButton
              className="SideBar__button SideBar__apply-button SideBar__apply-button_md_active"
              textClassName="SideBar__button-text"
              value="Apply"
              onClick={submitFilterChange}
            />

            <SimpleButton
              className="SideBar__button"
              textClassName="SideBar__button-text"
              value="Reset filter"
              onClick={resetFilter}
            />

          </div>

          {filterChanged && (
            <ShowButton
              className="SideBar__show-button"
              onClick={submitFilterChange}
              shouldCenter
              related={showButtonRelatedElementData}
            />
          )}
        </div>
      </aside>

      {isSideBarActiveOnMediumScreen && ReactDOM.createPortal(
        <ModalBg onClick={hideSideBar} className="SideBar__modal-bg" />,
        document.querySelector('.App')! || document.body,
      )}
    </>
  );
};

export default SideBar;
