import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { TMappedDispatch } from '@components/app/App';
import MainRoute from '@/components/routes/MainRoute';
import CheckoutRoute from '@components/routes/CheckoutRoute';
import routes from '@components/routes/routes';

import './style.scss';


interface IProps extends TMappedDispatch {
  className?: string;
}


const MainSection: React.FC<IProps> = ({ className, addToCart, removeFromCart }) => (
  <main className={`MainSection ${className}`}>
    <Switch>
      <Route exact path={`${routes.default}`}>
        <MainRoute addToCart={addToCart} removeFromCart={removeFromCart} />
      </Route>

      <Route path={`${routes.default}/checkout`}>
        <CheckoutRoute />
      </Route>

      <Route path="*">
        <Redirect to={`${routes.default}`} />
      </Route>
    </Switch>
  </main>
);

export default MainSection;
