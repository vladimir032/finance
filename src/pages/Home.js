import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        approvedApplications: 0,
        totalSponsors: 0,
        totalFunded: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('https://server-production-20ac.up.railway.app/api/stats');

                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                borderRadius: '0 0 20px 20px',
                marginBottom: '3rem'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Fund Your Startup Dreams
                </h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    Connect with sponsors who believe in your vision and get the funding you need to bring your ideas to life.
                </p>
                <Link to="/applications" className="btn btn-primary" style={{ 
                    background: 'white',
                    color: '#2c3e50',
                    textDecoration: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                }}>
                    Apply Now
                </Link>
            </section>

            {/* Stats Section */}
            <section className="grid" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#3498db', fontSize: '2rem' }}>{stats.totalApplications}</h3>
                    <p>Total Applications</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#2ecc71', fontSize: '2rem' }}>{stats.approvedApplications}</h3>
                    <p>Approved Projects</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#e74c3c', fontSize: '2rem' }}>{stats.totalSponsors}</h3>
                    <p>Active Sponsors</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: '#f1c40f', fontSize: '2rem' }}>${stats.totalFunded.toLocaleString()}</h3>
                    <p>Total Funded</p>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose HelpSP?</h2>
                <div className="grid">
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: '#3498db' }}>Simple Application Process</h3>
                        <p>Submit your startup proposal in minutes with our streamlined application process.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: '#3498db' }}>Direct Sponsor Connection</h3>
                        <p>Get directly connected with sponsors who are interested in your project.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: '#3498db' }}>Secure Transactions</h3>
                        <p>All financial transactions are handled securely through our platform.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: '#3498db' }}>Transparent Process</h3>
                        <p>Track your application status and funding progress in real-time.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="card" style={{ 
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
                <p style={{ marginBottom: '2rem' }}>Join thousands of successful startups who found their funding through HelpSP.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn" style={{ 
                        background: 'white',
                        color: '#2c3e50',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}>
                        Register Now
                    </Link>
                    <Link to="/about" className="btn" style={{ 
                        background: 'transparent',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        border: '2px solid white'
                    }}>
                        Learn More
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
