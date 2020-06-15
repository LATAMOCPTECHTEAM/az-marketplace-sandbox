import React from 'react';

export default function Footer() {
    return (
        <div className="page-footer font-small blue fixed-bottom" style={{ backgroundColor: "black" }}>
            <div className="footer-copyright text-center py-3">
                <img alt="Github Icon" src="icons/github-icon.png" width="36px" />
                <div>
                    <a href="https://github.com/psbds/az-marketplace-sandbox">Find it on GitHub</a>
                </div>
            </div>
        </div>
    );
}