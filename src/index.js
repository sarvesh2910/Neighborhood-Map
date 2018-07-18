import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import registerSW from './sw';

ReactDOM.render(<App />, document.getElementById('root'));

//register the service worker
registerSW();