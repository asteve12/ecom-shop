/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import './styles.scss';

interface IProps {
  onClick?: React.EventHandler<React.SyntheticEvent>;
  className?: string;
  style?: React.CSSProperties,
}


const ModalBg: React.FC<IProps> = ({ onClick, className, style }) => (
  <div
    role="button"
    tabIndex={0}
    onKeyPress={onClick}
    onClick={onClick}
    className={`ModalBg ${className || ''}`}
    style={style}
  />
);

export default ModalBg;
