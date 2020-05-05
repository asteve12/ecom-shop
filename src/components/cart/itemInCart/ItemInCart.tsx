import React, { useState, useEffect } from 'react';
import { TProductInCart } from '@components/cart/Cart';
import { TRemoveFromCart } from '@components/app/App';
import TextInput, { TChangeHandler } from '@/components/ui/inputs/text/TextInput';
import SimpleButton from '@/components/ui/buttons/simpleButton/SimpleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import './style.scss';


export type TSetNumber = (id: string, n: number) => void;
interface IProps {
  removeFromCart: TRemoveFromCart;
  updateNumber: TSetNumber;
  prod: TProductInCart;
  className?: string;
}


/**
 * Get input value as a number
 */
export const getValidatedInputValue = (target: EventTarget & HTMLInputElement): number => {
  const { value } = target;
  const onlyDigitals: RegExp = /^\d+$/;

  if (value && value.match(onlyDigitals)) {
    return value[0] === '0'
      ? parseInt(value.substr(1), 10)
      : parseInt(value, 10);
  }
  return 0;
};


const ItemInCart: React.FC<IProps> = ({ removeFromCart, updateNumber, prod, className }) => {
  const { id, number } = prod;
  const [value, setValue] = useState<number>(number);

  const onChange: TChangeHandler = (e) => {
    const { target } = e;
    const newValue: number = getValidatedInputValue(target);

    setValue(newValue);
  };

  useEffect(() => {
    updateNumber(id, value);
  }, [value]);

  useEffect(() => {
    setValue(number);
  }, [prod.number]);

  return (
    <div className={`ItemInCart ${className || ''}`}>
      <span className="ItemInCart__title">{prod.name}</span>

      <div className="ItemInCart__number-control-container">

        <SimpleButton textClassName="ItemInCart__button-text" className="ItemInCart__number-control" onClick={() => { setValue((prevValue) => (prevValue + 1)); }}>+</SimpleButton>
        <TextInput className="ItemInCart__text-input" value={prod.number} onChange={onChange} />
        <SimpleButton textClassName="ItemInCart__button-text" className="ItemInCart__number-control" onClick={() => { setValue((prevValue) => (prevValue - 1)); }}>-</SimpleButton>

        <SimpleButton textClassName="ItemInCart__button-text" className="ItemInCart__number-control ItemInCart__number-control_remove-whole-item" onClick={() => { removeFromCart(id); }}>
          <FontAwesomeIcon className="ItemInCart__remove-whole-item-icon" icon={faPlus} />
        </SimpleButton>

      </div>
    </div>
  );
};

export default React.memo(ItemInCart, (prev, cur) => prev.prod.number === cur.prod.number);
