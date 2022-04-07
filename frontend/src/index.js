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


/* 
All code is encapsulated in a self-exectuing anonymous function to prevent parsing and scope errors with other script files.
See: https://stackoverflow.com/questions/592396/what-is-the-purpose-of-a-self-executing-function-in-javascript
*/
( function () {
    'use strict'; // Prevents the use of some JS syntax and patters that can lead to mysterious errors.

    // Here I have aliased the document root <HTML> element as 'HTML' because 'document.documentElement' is a little bitch.
    // Read about the DOM ( document ) here: https://developer.mozilla.org/en-US/docs/Web/API/Document
    const html = document.documentElement;

    /* 
    This registers a function that will execute upon the 'DOMContentLoaded' event; that event 
    fires when the browser finishes parsing the html file, however, that does not mean that all assets have been parsed or loaded.
    */
    window.addEventListener( 'DOMContentLoaded', onDOMReady );

    /* 
    This registers a function that will execute upon the 'load' event.
    The 'load' event is fired when all assets, e.g. stylesheets, scripts, images, etc..., have been parsed and loaded.
    */
    window.addEventListener( 'load', onLoad );


    /* 
    It is genereally safe to perform operations on the HTML document itself when this function executes.
    Assets are another story, i.e. if you wish to find the height of an image, you very well may run into
    'undefined' errors as there is no guarantee that the image has actually loaded yet.
    The same is true of any asset or element of the DOM that relies upon assets, e.g. elements that are dynamically added via other scripts.
    */
    function onDOMReady () {
        /* 
        Get the header/nav bar element node in the DOM and save it as a property of the HTML object for later use.
        See: https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
        */
        html.nav = html.querySelector( '.main-navigation' );

        /* 
        Here I am running two utility functions that store useful and often used window and page data as global variables 
        and register some useful event handler functions respectively.
        */
        initializeGlobalVariables();
        initializeEventHandlers();

        //canvasController( 'hero-canvas' )

        // your setup code 

    }

    /* 
    By the time this function executes it is safe perform operations upon anything on the webpage, with the small but
    enourmouslly frustrating exception of elements affected dynamically by third-party scripts.
    OWL-Slider.js: "My friend doesn't like you. I don't like you either!"
    Revolution-Carosel.js: *laughs in alien*
    OWL-Slider.js: "We're wanted scripts on twelve worlds!"
    You: "OK, I'll be careful!"
    OWL-Slider.js: "You'll be dead!"
    */
    function onLoad () {
        // your main code

    }

    function initializeGlobalVariables () {
        html.ww = 0; // window width
        html.wh = 0; // window height
        html.hh = 0; // header height

    }


    function updateGlobalVariables () {
        /* 
        Use short-circuit evaluation to get the width and height with cross-browser compatibility.
        See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators
        */
        html.ww = html.clientWidth || document.body.clientWidth || window.innerWidth;
        html.wh = window.innerHeight || html.clientHeight;

        /* 
        Here we use a ternary expression to check if the header/nav bar actually exists; if it does we grab it's height, 
        if not, we just assign the header-height the very nice and safe value of 0, as it will not break any style calculations
        like 'undefined' or 'null' would.
        */
        html.hh = html.nav ? html.nav.offsetHeight : 0;

    }

    /* 
    Executes every time the window is resized.
    */
    function onResize () {
        updateGlobalVariables();
        setRootCSSVariables();

    }

    /* 
    Executes everytime the user scrolls.
    */
    function onScroll () {
        // transitionHeaderStyle();

    }

    /* 
    Registers the above two functions to their respective DOM events.
    You will notice that immediatelly after registering the function to their listener, I dispatch the
    respective event to the window. This ensures that these function run at least once when they are initalized.
    */
    function initializeEventHandlers () {
        window.addEventListener( 'scroll', onScroll, { passive: true } );
        window.dispatchEvent( new Event( 'scroll' ) );

        window.addEventListener( 'resize', onResize );
        window.dispatchEvent( new Event( 'resize' ) );

    }

    /* 
    Attatches your window variables to the root HTML element as inline CSS variables, i.e., 'custom properties'.
    These are accessible within your stylesheets.
    See: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
    */
    function setRootCSSVariables () {
        html.style.setProperty( '--window-width', ( html.ww ) + 'px' );
        html.style.setProperty( '--window-height', ( html.wh ) + 'px' );
        html.style.setProperty( '--header-height', ( html.hh ) + 'px' );
        html.style.setProperty( '--header-adjusted-window-height', ( html.wh - html.hh ) + 'px' );

    }


    function transitionHeaderStyle () {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        requestAnimationFrame( () => {
            /* 
            * Get the css variables from computed style.
            */
            const styles = getComputedStyle( html );

            /*
            The ratio of the viewport top edge position over the window height, e.g., 247px / 980px.
            */
            const ratio = document.body.scrollTop / html.wh;

            /* 
            The clamped ratio. In this instance, any values over 1.0 are useless, and scrolling 
            the page further than one window height will produce a ratio larger than 1.0, so we just
            throw those values out and clamp the ratio to 1.0 when they occur.
            */
            const rCubed = ratio ** 3;
            const cr = rCubed >= 0.88 ? 0.88 : rCubed;

            /* 
            Here we set the opacity style of the element to range from 1.0 at 0px scrolled to 0.7 at 'window-height'px scrolled.
            You will notice that this will result in values larger than 1, however this still functions as the opacity property regards
            any values larger than 1.0 as 1.0 and any values less than 0 as 0.
            */
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
