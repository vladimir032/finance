import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Sample sponsor data (in a real app, this would come from the API)
    const sampleSponsors = [
        {
            id: 1,
            name: 'TechVentures Capital',
            type: 'Company',
            description: 'A leading venture capital firm focused on early-stage technology startups. We believe in supporting innovative solutions that shape the future.',
            image_url: 'https://via.placeholder.com/150',
            approved_applications: 45,
            total_funded: 2500000
        },
        {
            id: 2,
            name: 'Green Innovation Fund',
            type: 'Organization',
            description: 'Dedicated to funding sustainable and eco-friendly startups that contribute to environmental conservation and green technology.',
            image_url: 'https://via.placeholder.com/150',
            approved_applications: 32,
            total_funded: 1800000
        },
        {
            id: 3,
            name: 'Sarah Johnson',
            type: 'Individual',
            description: 'Angel investor with 15 years of experience in supporting early-stage startups. Focused on fintech and healthcare innovations.',
            image_url: 'https://via.placeholder.com/150',
            approved_applications: 28,
            total_funded: 900000
        },
        {
            id: 4,
            name: 'Digital Future Foundation',
            type: 'Organization',
            description: 'Supporting digital transformation initiatives and technology education projects worldwide.',
            image_url: 'https://via.placeholder.com/150',
            approved_applications: 38,
            total_funded: 2100000
        },
        {
            id: 5,
            name: 'Global Impact Investments',
            type: 'Company',
            description: 'International investment firm focusing on startups that create significant social impact alongside financial returns.',
            image_url: 'https://via.placeholder.com/150',
            approved_applications: 52,
            total_funded: 3200000
        }
    ];

    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setSponsors(sampleSponsors);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <section style={{ 
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                color: 'white',
                padding: '3rem 2rem',
                borderRadius: '10px',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '1rem' }}>Our Sponsors</h1>
                <p style={{ maxWidth: '800px', margin: '0 auto' }}>
                    Meet the visionary individuals and organizations who make dreams come true. 
                    Our sponsors are committed to supporting innovative startups and fostering entrepreneurship.
                </p>
            </section>

            <div style={{ marginBottom: '3rem' }}>
                <div className="grid" style={{ gap: '2rem' }}>
                    {sponsors.map(sponsor => (
                        <div key={sponsor.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <img 
                                    src={sponsor.image_url} 
                                    alt={sponsor.name}
                                    style={{ 
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{sponsor.name}</h3>
                                    <span className="badge" style={{ 
                                        backgroundColor: '#e0e0e0',
                                        color: '#333'
                                    }}>
                                        {sponsor.type}
                                    </span>
                                </div>
                            </div>
                            
                            <p style={{ marginBottom: '1.5rem', flex: 1 }}>{sponsor.description}</p>
                            
                            <div style={{ 
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                backgroundColor: '#f8f9fa',
                                padding: '1rem',
                                borderRadius: '4px'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                                        {sponsor.approved_applications}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                        Projects Funded
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
                                        ${(sponsor.total_funded / 1000000).toFixed(1)}M
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                        Total Funded
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <section className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Become a Sponsor</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                    Join our community of visionary sponsors and help shape the future of innovation. 
                    Contact us to learn more about sponsorship opportunities.
                </p>
                <button className="btn btn-primary">Contact Us</button>
            </section>
        </div>
    );
};

export default Sponsors;
