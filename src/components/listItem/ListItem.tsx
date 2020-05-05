import React from 'react';

import './style.scss';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const ListItem: React.FC<IProps> = ({ children, className }) => (
  <li className={`ListItem ${className || ''}`}>
    {children}
  </li>
);

export default ListItem;
