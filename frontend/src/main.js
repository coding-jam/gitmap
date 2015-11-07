import 'bootstrap/css/bootstrap.css!';
import 'sweetalert/dist/sweetalert.css!';

import swal from "sweetalert";
import React from "react";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import Reducers from 'src/Reducers';
import App from 'src/components/App';
import Actions from 'src/Actions';

import createLogger from 'redux-logger';

const logger = createLogger({
  level: 'debug'
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger
)(createStore);

let store = createStoreWithMiddleware(Reducers);

window.swal = swal;

export default (function(){

	React.render(
		<Provider store={store}>{() => <App/>}</Provider>
	,document.getElementById('wrapper'));
})();
