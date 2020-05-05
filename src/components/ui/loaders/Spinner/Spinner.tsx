import React from 'react';
import './style.scss';


interface IProps {
  className?: string;
  spinnerClassName?: string;
}


const Spinner: React.FC<IProps> = ({ className, spinnerClassName }) => (
  <div className={`Spinner ${className || ''}`}>
    <div className={`Spinner__loader ${spinnerClassName || ''}`} />
  </div>
);

export default Spinner;
