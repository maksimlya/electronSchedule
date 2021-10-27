import ReactDOM from 'react-dom';
import React from 'react';
import {CalendarLayout} from './renderProcess/Layout.jsx';

const App = () => {
    console.log('a');
 return <CalendarLayout/>;
 }
ReactDOM.render(<App />, document.getElementById('app'));