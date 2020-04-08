/**
 * コアモジュール
 */
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from 'connected-react-router';
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory, History } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * history
 */
export const history = createBrowserHistory();

/**
 * store
 */
const store = createStore(
  combineReducers({
    router: connectRouter(history)
  }),
  {},
  compose(applyMiddleware(routerMiddleware(history)))
);

/**
 * container
 */
import { root } from 'src/component/root';
import { code } from 'src/component/code';

/**
 * render
 */
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path={'/'} component={root} />
        <Route exact path={'/code.html'} component={code} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

/**
 * 戻るボタンでリロード
 * https://teratail.com/questions/61484
 */
window.addEventListener('popstate', e => {
  window.location.reload();
});
