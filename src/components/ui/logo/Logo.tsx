import React from 'react';
import { Link } from 'react-router-dom';

import './style.scss';

const Logo: React.FC = () => (
  <div className="Logo">
    <div className="Logo__container">
      <Link to="/" className="Logo__link">
        E-Phones
      </Link>
    </div>
  </div>
);

export default Logo;
