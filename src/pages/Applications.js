import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Applications = () => {
    const { isAuthenticated } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        project_name: '',
        project_type: '',
        description: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        amount: ''
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('https://server-production-20ac.up.railway.app/api/applications');

            setApplications(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching applications');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('https://server-production-20ac.up.railway.app/api/applications', formData);

            setShowForm(false);
            setFormData({
                project_name: '',
                project_type: '',
                description: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                amount: ''
            });
            fetchApplications();
        } catch (error) {
            setError('Error submitting application');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'badge badge-approved';
            case 'rejected':
                return 'badge badge-rejected';
            default:
                return 'badge badge-pending';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Please login to view and submit applications</h2>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Funding Applications</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'New Application'}
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Submit New Application</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid" style={{ gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Project Name</label>
                                <input
                                    type="text"
                                    name="project_name"
                                    className="form-input"
                                    value={formData.project_name}
                                    onChange={handleInputChange}
                                    required
                                    
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Project Type</label>
                                <select
                                    name="project_type"
                                    className="form-input"
                                    value={formData.project_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="tech">Technology</option>
                                    <option value="business">Business</option>
                                    <option value="social">Social Enterprise</option>
                                    <option value="creative">Creative</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-input"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    style={{ resize: 'vertical', maxHeight: '150px' }} // Allow vertical resizing and limit height
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-input"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-input"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Requested Amount ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-input"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Submit Application
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : (
                <div>
                    {applications.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>No applications found. Submit your first application!</p>
                        </div>
                    ) : (
                        applications.map(application => (
                            <div key={application.id} className="card" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3>{application.project_name}</h3>
                                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                                            Submitted on {new Date(application.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={getStatusBadgeClass(application.status)}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </span>
                                </div>
                                <p style={{ marginBottom: '1rem' }}>{application.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                                    <span>Type: {application.project_type}</span>
                                    <span>Amount: ${application.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Applications;
