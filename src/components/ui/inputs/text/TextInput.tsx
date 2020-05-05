/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './style.scss';


export type TInputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TInputFocusEvent = React.FocusEventHandler<HTMLInputElement>;
export type TChangeHandler = (e: TInputChangeEvent) => void;

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | string[] | number | undefined;
  onChange?: TChangeHandler;
  onBlur?: TInputFocusEvent;
  data?: {
    [key: string]: string,
  },
  className?: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
}


const TextInput: React.ForwardRefRenderFunction<HTMLInputElement, IProps> = (props, ref) => {
  const {
    value,
    onChange,
    onBlur,
    data = {},
    className,
    id,
    name,
    placeholder,
    defaultValue,
    type = 'text',
  } = props;

  return (
    <input
      type={type}
      name={name}
      id={id}
      className={`TextInput ${className || ''}`}
      ref={ref}
      {...data}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default React.forwardRef<HTMLInputElement, IProps>(TextInput);
