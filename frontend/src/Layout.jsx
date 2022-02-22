import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";

export default function Layout ( props ) {
    return <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem"
                }}
            >
                <Link to="/">Home</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/invoices">Invoices</Link>
                <Link to="/expenses">Expenses</Link>
            </nav>
        </header>
        <main>
            {props.children}
        </main>
    </div>;
};