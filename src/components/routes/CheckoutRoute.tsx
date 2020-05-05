import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '@components/routes/routes';
import CheckoutPage from '../pages/CheckoutPage';
import Checkout from '../checkout/Checkout';


interface IProps {
  children?: React.ReactNode;
}

const CheckoutRoute: React.FC<IProps> = () => (
  <CheckoutPage>
    <Switch>
      <Route exact path={`${routes.default}/checkout`}>
        <Checkout />
      </Route>

      <Route path={`${routes.default}/checkout/:any`}>
        <Redirect to={`${routes.default}/checkout`} />
      </Route>
    </Switch>
  </CheckoutPage>
);

export default CheckoutRoute;
