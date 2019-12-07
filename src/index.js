import React from 'react';
import ReactDOM from 'react-dom';
import 'antd-mobile/dist/antd-mobile.css';
import './index.css';
import './css/clear.css';
import App from './App';
import {EventEmitter} from 'events';
import {getUrlParams} from './utils/common';
import TTTRtcWeb from 'tttwebsdk';

window.eventBus = new EventEmitter();
window.eventBus.setMaxListeners(0);
window.RTC = new TTTRtcWeb();

let role = getUrlParams().role || 2;
const isPC = /windows/i.test(navigator.userAgent);
window.TTTRoom = {
    client: window.RTC.createClient({role}), // 1:主播， 2:副播  3:观众
    remoteStream: new Map(),
    users: {}
};

ReactDOM.render(<App />, document.getElementById('root'));
