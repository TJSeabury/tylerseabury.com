import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';

import Home from './routes/Home';
import Blog from './routes/Blog';
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";

( function () {
    const html = document.documentElement;

    window.addEventListener( 'DOMContentLoaded', onDOMReady );
    window.addEventListener( 'load', onLoad );

    function onDOMReady () {
        html.nav = html.querySelector( '.main-navigation' );

        initializeGlobalVariables();
        initializeEventHandlers();

    }

    function onLoad () {
        // your main code

    }

    function initializeGlobalVariables () {
        html.ww = 0; // window width
        html.wh = 0; // window height
        html.hh = 0; // header height

    }


    function updateGlobalVariables () {
        html.ww = html.clientWidth || document.body.clientWidth || window.innerWidth;
        html.wh = window.innerHeight || html.clientHeight;
        html.hh = html.nav ? html.nav.offsetHeight : 0;

    }

    function onResize () {
        updateGlobalVariables();
        setRootCSSVariables();

    }

    function onScroll () {
        // transitionHeaderStyle();

    }

    function initializeEventHandlers () {
        window.addEventListener( 'scroll', onScroll, { passive: true } );
        window.dispatchEvent( new Event( 'scroll' ) );

        window.addEventListener( 'resize', onResize );
        window.dispatchEvent( new Event( 'resize' ) );

    }

    function setRootCSSVariables () {
        html.style.setProperty( '--window-width', ( html.ww ) + 'px' );
        html.style.setProperty( '--window-height', ( html.wh ) + 'px' );
        html.style.setProperty( '--header-height', ( html.hh ) + 'px' );
        html.style.setProperty( '--header-adjusted-window-height', ( html.wh - html.hh ) + 'px' );

    }


    function transitionHeaderStyle () {
        requestAnimationFrame( () => {
            const styles = getComputedStyle( html );
            const ratio = document.body.scrollTop / html.wh;
            const rCubed = ratio ** 3;
            const cr = rCubed >= 0.88 ? 0.88 : rCubed;
            html.nav.style.setProperty( '--background-color', 'hsla( var( --color-primary-hsl ), ' + ( cr ) + ' )' );
            let headerHeight = parseInt( styles.getPropertyValue( '--header-height' ) );
            html.nav.style.setProperty( 'height', ( headerHeight - ( headerHeight / 3 ) * cr ) + 'px' );
            html.nav.style.setProperty( 'box-shadow', '0 2px 2px 0 hsla( var( --color-dark-gray-hsl ), ' + ( cr / 4 ) + ' )' );
            /* if ( cr > 0.7 )
            {
                html.nav.style.setProperty( '--highlight', 'var( --color-dark-gray-hsl )' );
            }
            else
            {
                html.nav.style.setProperty( '--highlight', 'var( --color-highlight-hsl )' );
            } */
        } );
    }
} )();


const navigation = [
    <Link to="/">Home</Link>,
    <Link to="/blog">Blog</Link>,
    <Link to="/invoices">Invoices</Link>,
    <Link to="/expenses">Expenses</Link>,
    <a href="tel:+14134395508">(413) 439-5508</a>,
];

const root = document.getElementById( 'root' );
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home
                navigation={navigation}
            />} />
            <Route path="blog" element={<Blog
                navigation={navigation}
            />} />
            <Route path="expenses" element={<Expenses
                navigation={navigation}
            />} />
            <Route path="invoices" element={<Invoices
                navigation={navigation}
            />} />
        </Routes>
    </BrowserRouter>,
    root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
