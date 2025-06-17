import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                © {new Date().getFullYear()} AI Resume Tailor. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
