import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import { TMappedDispatch } from '@components/app/App';
import MainPage from '@components/pages/mainPage/MainPage';
import SimpleButton from '@components/ui/buttons/simpleButton/SimpleButton';
import Main from '@components/main/Main';
import SideBar from '@components/sidebar/SideBar';
import routes from '@components/routes/routes';


interface IProps extends TMappedDispatch {
  children?: React.ReactNode;
}

const MainRoute: React.FC<IProps> = ({ addToCart, removeFromCart }) => {
  const [isSideBarActiveOnMediumScreen, setSideBarActiveOnMediumScreen] = useState<boolean>(false);

  return (
    <MainPage>
      <SimpleButton
        value="Filter"
        className="MainPage__filter-button"
        onClick={() => { setSideBarActiveOnMediumScreen((prevState) => !prevState); }}
      />

      <SideBar
        showSideBar={setSideBarActiveOnMediumScreen}
        isSideBarActiveOnMediumScreen={isSideBarActiveOnMediumScreen}
        className={`MainPage__sidebar ${isSideBarActiveOnMediumScreen ? 'SideBar_md_active' : 'SideBar_md_inactive'}`}
      />

      <Switch>
        <Route exact path={routes.default}>
          <Main addToCart={addToCart} removeFromCart={removeFromCart} />
        </Route>
      </Switch>
    </MainPage>
  );
};

export default MainRoute;
