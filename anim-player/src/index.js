import React from 'react';
import ReactDOM from 'react-dom/client';
import WebPath from './WebPath';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <WebPath />
    </BrowserRouter>
 
);