import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';

import ThreeD from './routes/ThreeD';
import App from './routes/App';
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

const root = document.getElementById( 'root' );
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<ThreeD />} />
            <Route path="blog" element={<App />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="invoices" element={<Invoices />} />
        </Routes>
    </BrowserRouter>,
    root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
