/* eslint-disable react/button-has-type */
import React from 'react';
import './style.scss';


interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: React.EventHandler<React.SyntheticEvent<HTMLButtonElement>>;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}


const SimpleButton: React.FC<IProps> = (props) => {
  const {
    onClick,
    value = '',
    className,
    textClassName,
    disabled = false,
    children,
    type = 'button',
  } = props;

  return (
    <button type={type} onClick={type !== 'submit' ? onClick : undefined} className={`SimpleButton ${className || ''}`} disabled={disabled}>
      <span className={`SimpleButton__text ${textClassName || ''}`}>
        {value}
        {children}
      </span>
    </button>
  );
};

export default SimpleButton;
