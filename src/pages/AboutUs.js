import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div>
            {/* Hero Section */}
            <section style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                padding: '4rem 2rem',
                borderRadius: '10px',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About HelpSP</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
                    Empowering entrepreneurs and innovators to bring their ideas to life through 
                    community-driven funding and support.
                </p>
            </section>

            {/* Mission Section */}
            <section className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Our Mission</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    At HelpSP, we believe that great ideas deserve the chance to become reality. 
                    Our platform connects innovative startups with sponsors who share their vision 
                    for the future. We're committed to fostering entrepreneurship and supporting 
                    projects that make a difference in the world.
                </p>
            </section>

            {/* How It Works */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>How It Works</h2>
                <div className="grid">
                    <div className="card">
                        <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>1. Submit Your Application</h3>
                        <p>
                            Share your startup idea, business plan, or creative project. 
                            Provide details about your goals, required funding, and how you'll 
                            use the resources.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>2. Review Process</h3>
                        <p>
                            Our sponsors carefully review each application, evaluating the 
                            potential impact, viability, and innovation of your project.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>3. Get Funded</h3>
                        <p>
                            Approved projects receive funding directly through our secure 
                            platform. Track your funds and manage your project's financial 
                            aspects easily.
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Why Choose Us</h2>
                <div className="grid">
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Secure Platform</h3>
                        <p>
                            Our platform ensures secure transactions and protects your 
                            sensitive information using industry-standard security measures.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Transparent Process</h3>
                        <p>
                            Track your application status, manage funds, and communicate 
                            with sponsors through our user-friendly interface.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Global Network</h3>
                        <p>
                            Connect with sponsors and entrepreneurs from around the world, 
                            expanding your opportunities for growth and collaboration.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Dedicated Support</h3>
                        <p>
                            Our team is here to help you throughout your journey, from 
                            application to funding and beyond.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Contact Us</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>General Inquiries</h3>
                        <p style={{ marginBottom: '0.5rem' }}>Email: contact@helpsp.com</p>
                        <p style={{ marginBottom: '0.5rem' }}>Phone: +1 (555) 123-4567</p>
                        <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Support</h3>
                        <p style={{ marginBottom: '0.5rem' }}>Email: support@helpsp.com</p>
                        <p style={{ marginBottom: '0.5rem' }}>Phone: +1 (555) 987-6543</p>
                        <p>24/7 Support Available</p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Office Location</h3>
                        <p style={{ marginBottom: '0.5rem' }}>123 Startup Street</p>
                        <p style={{ marginBottom: '0.5rem' }}>Innovation City, 12345</p>
                        <p>United States</p>
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
                <p style={{ marginBottom: '2rem' }}>
                    Join our community of innovators and make your startup dreams a reality.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" className="btn" style={{ 
                        background: 'white',
                        color: '#2c3e50',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}>
                        Get Started
                    </Link>
                    <Link to="/sponsors" className="btn" style={{ 
                        background: 'transparent',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        border: '2px solid white'
                    }}>
                        Meet Our Sponsors
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
