import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import './style.scss';


interface IProps {
  onClick: React.EventHandler<React.SyntheticEvent<HTMLButtonElement>>;
  style?: React.StyleHTMLAttributes<HTMLButtonElement>;
  className?: string;
  iconClassName?: string;
}


const CloseButton: React.FC<IProps> = ({ className = '', iconClassName = '', onClick }) => (
  <button type="button" onClick={onClick} className={`CloseButton ${className}`}>
    <FontAwesomeIcon className={iconClassName} icon={faPlus} />
  </button>
);

export default CloseButton;
