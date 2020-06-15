import React from 'react';
import config from "config";

function Header() {
    return (
        <div className="Header">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="/"><img alt="Microsoft Logo" src="/icons/microsoft-icon.png" style={{ height: "16px", marginTop: "-3px", marginRight: "10px" }} />Azure Marketplace Sandbox</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/subscriptions">Subscriptions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/settings">Settings</a>
                        </li>
                    </ul>
                    <span className="navbar-text">
                        <a href={`${config.swagger}`} target="_blank" rel="noopener noreferrer" >
                            <img alt="Swagger UI" src="/icons/swagger-logo.png" style={{ height: "30px" }} />
                        </a>
                    </span>
                </div>

            </nav>
        </div>
    );
}

export default Header;
