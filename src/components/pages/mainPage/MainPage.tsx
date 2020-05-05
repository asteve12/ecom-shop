import React from 'react';

import './style.scss';

interface IProps {
  children?: React.ReactNode;
}

const MainPage: React.FC<IProps> = ({ children }) => (
  <div className="MainPage">
    <div className="MainPage__inner">
      {children}
    </div>
  </div>
);

export default MainPage;
