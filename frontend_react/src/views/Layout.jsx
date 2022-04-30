import React from 'react';
import '../App.css';

export default function Layout ( props ) {
    return <div className="App">
        <main>
            {props.children}
        </main>
        <footer>
            <div className="content-group" >
                <p>© Copyright {`${new Date().getFullYear()}`} Tyler Seabury</p>
            </div>
        </footer>
    </div>;
};