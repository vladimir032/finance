import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>HelpSP</h3>
                    <p>Supporting innovative startups and entrepreneurs in their journey to success.</p>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none' }}>
                        <li><Link to="/" style={{ color: 'white', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>Home</Link></li>
                        <li><Link to="/applications" style={{ color: 'white', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>Applications</Link></li>
                        <li><Link to="/about" style={{ color: 'white', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>About Us</Link></li>
                        <li><Link to="/sponsors" style={{ color: 'white', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>Sponsors</Link></li>
                        <li><Link to="/reviews" style={{ color: 'white', textDecoration: 'none', marginBottom: '0.5rem', display: 'block' }}>Reviews</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Contact Information</h4>
                    <p style={{ marginBottom: '0.5rem' }}>Email: contact@helpsp.com</p>
                    <p style={{ marginBottom: '0.5rem' }}>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Startup Street, Innovation City, 12345</p>
                </div>
                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Terms of Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Privacy Policy</li>
                        <li>Cookie Policy</li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <p>&copy; {new Date().getFullYear()} HelpSP. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
