import React from 'react';
import './style.scss';


interface IProps {
  value?: string;
  children?: React.ReactNode;
  className?: string;
}


const Tooltip: React.FC<IProps> = ({ className, value, children }) => (
  <div className={`Tooltip ${className || ''}`}>
    <div className="Tooltip__inner">
      {value}
      {children}
    </div>
  </div>
);

export default Tooltip;
