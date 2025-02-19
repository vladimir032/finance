import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isNavOpen, setNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setNavOpen(false); // Закрываем меню после выхода
    };

    const toggleNav = () => {
        setNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setNavOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="logo" onClick={closeNav}>
                    HelpSP
                </Link>

                <div className="hamburger" onClick={toggleNav}>
                    ☰
                </div>

                <div className={`nav-menu ${isNavOpen ? "open" : ""}`}>
                    <button className="close-btn" onClick={closeNav}>✖</button>
                    <ul>
                        <li><Link to="/" onClick={closeNav}>Home</Link></li>
                        {isAuthenticated && <li><Link to="/applications" onClick={closeNav}>Applications</Link></li>}
                        <li><Link to="/about" onClick={closeNav}>About Us</Link></li>
                        <li><Link to="/sponsors" onClick={closeNav}>Sponsors</Link></li>
                        <li><Link to="/reviews" onClick={closeNav}>Reviews</Link></li>

                        {!isAuthenticated ? (
                            <>
                                <li><Link to="/login" onClick={closeNav}>Login</Link></li>
                                <li><Link to="/register" onClick={closeNav}>Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/profile" onClick={closeNav}>My Profile</Link></li>
                                {user?.role === "admin" && (
                                    <li><Link to="/admin" onClick={closeNav}>Admin Panel</Link></li>
                                )}
                                <li>
                                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
