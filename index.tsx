import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Store, Action } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { TState, TAction } from '@/reducers/types';
import rootReducer from '@/reducers/rootReducer';

import App from '@/components/app/App';

import '@/index.scss';


const composeEnhancers = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(rootReducer, composeEnhancers);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
