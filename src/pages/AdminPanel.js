import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [siteContent, setSiteContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit states
    const [editingApplication, setEditingApplication] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [editingContent, setEditingContent] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editUserBalance, setEditUserBalance] = useState({
        personal_balance: '',
        sponsor_balance: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            switch (activeTab) {
                case 'applications':
                    const appResponse = await axios.get('https://server-production-20ac.up.railway.app/api/admin/applications');

                    setApplications(appResponse.data);
                    break;
                case 'reviews':
                    const reviewResponse = await axios.get('https://server-production-20ac.up.railway.app/api/admin/reviews');

                    setReviews(reviewResponse.data);
                    break;
                case 'users':
                    const userResponse = await axios.get('https://server-production-20ac.up.railway.app/api/admin/users');

                    setUsers(userResponse.data);
                    break;
                case 'content':
                    const contentResponse = await axios.get('https://server-production-20ac.up.railway.app/api/admin/site-content');

                    setSiteContent(contentResponse.data);
                    break;
            }
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const handleApplicationUpdate = async (id, status) => {
        try {
            await axios.put(`https://server-production-20ac.up.railway.app/api/admin/applications/${id}`, { status });

            fetchData();
        } catch (error) {
            setError('Error updating application');
        }
    };

    const handleReviewUpdate = async (id, data) => {
        try {
            await axios.put(`https://server-production-20ac.up.railway.app/api/admin/reviews/${id}`, data);

            setEditingReview(null);
            fetchData();
        } catch (error) {
            setError('Error updating review');
        }
    };

    const handleReviewDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`https://server-production-20ac.up.railway.app/api/admin/reviews/${id}`);

            fetchData();
        } catch (error) {
            setError('Error deleting review');
        }
    };

    const handleContentUpdate = async (id, data) => {
        try {
            await axios.put(`https://server-production-20ac.up.railway.app/api/admin/site-content/${id}`, data);

            setEditingContent(null);
            fetchData();
        } catch (error) {
            setError('Error updating content');
        }
    };

    const handleUserBalanceEdit = (user) => {
        setEditingUser(user);
        setEditUserBalance({
            personal_balance: user.personal_balance || 0,
            sponsor_balance: user.sponsor_balance || 0
        });
    };

    const handleBalanceUpdate = async (userId) => {
        try {
            await axios.put(`https://server-production-20ac.up.railway.app/api/admin/users/${userId}/balance`, editUserBalance);

            // Update the users list immediately
            setUsers(prevUsers => prevUsers.map(u => {
                if (u.id === userId) {
                    return {
                        ...u,
                        personal_balance: editUserBalance.personal_balance,
                        sponsor_balance: editUserBalance.sponsor_balance
                    };
                }
                return u;
            }));
            setEditingUser(null);
        } catch (error) {
            setError('Error updating user balance');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to access this page.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Admin Panel</h2>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    className={`btn ${activeTab === 'applications' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Applications
                </button>
                <button 
                    className={`btn ${activeTab === 'reviews' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button 
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={`btn ${activeTab === 'content' ? 'btn-primary' : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    Site Content
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : (
                <div>
                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <div>
                            {applications.map(app => (
                                <div key={app.id} className="card" style={{ marginBottom: '1rem' }}>
                                    {editingApplication === app.id ? (
                                        <div>
                                            {/* Application Edit Form */}
                                            <button 
                                                className="btn"
                                                onClick={() => setEditingApplication(null)}
                                                style={{ marginBottom: '1rem' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <h3>{app.project_name}</h3>
                                                <span className={`badge badge-${app.status}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p style={{ marginBottom: '1rem' }}>{app.description}</p>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => handleApplicationUpdate(app.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={() => handleApplicationUpdate(app.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div>
                            {reviews.map(review => (
                                <div key={review.id} className="card" style={{ marginBottom: '1rem' }}>
                                    {editingReview === review.id ? (
                                        <div>
                                            <div className="form-group">
                                                <label className="form-label">Rating</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={review.rating}
                                                    onChange={(e) => setReviews(prev => 
                                                        prev.map(r => r.id === review.id ? 
                                                            { ...r, rating: parseInt(e.target.value) } : r
                                                        )
                                                    )}
                                                    min="1"
                                                    max="5"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Comment</label>
                                                <textarea
                                                    className="form-input"
                                                    value={review.comment}
                                                    onChange={(e) => setReviews(prev => 
                                                        prev.map(r => r.id === review.id ? 
                                                            { ...r, comment: e.target.value } : r
                                                        )
                                                    )}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => handleReviewUpdate(review.id, review)}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    className="btn"
                                                    onClick={() => setEditingReview(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{ color: '#f1c40f', fontSize: '1.2rem' }}>
                                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                    <div style={{ color: '#666' }}>by {review.user_email}</div>
                                                </div>
                                                <div style={{ color: '#666' }}>
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p style={{ marginBottom: '1rem' }}>{review.comment}</p>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => setEditingReview(review.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-danger"
                                                    onClick={() => handleReviewDelete(review.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="card">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Personal Balance</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Sponsor Balance</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created At</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.email}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{user.role}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                                                ${user.personal_balance?.toLocaleString() || '0'}
                                            </td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                                                ${user.sponsor_balance?.toLocaleString() || '0'}
                                            </td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                                                <button 
                                                    className="btn btn-primary" 
                                                    style={{ marginRight: '0.5rem' }}
                                                    onClick={() => handleUserBalanceEdit(user)}
                                                >
                                                    Edit Balance
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Balance Edit Modal */}
                            {editingUser && (
                                <div className="modal" style={{ 
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1000
                                }}>
                                    <div className="card" style={{ 
                                        padding: '2rem',
                                        maxWidth: '500px',
                                        width: '90%',
                                        backgroundColor: 'white'
                                    }}>
                                        <h3 style={{ marginBottom: '1rem' }}>Edit User Balance</h3>
                                        <p style={{ marginBottom: '1rem', color: '#666' }}>User: {editingUser.email}</p>
                                        
                                        <div className="form-group">
                                            <label className="form-label">Personal Balance ($)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={editUserBalance.personal_balance}
                                                onChange={(e) => setEditUserBalance(prev => ({
                                                    ...prev,
                                                    personal_balance: parseFloat(e.target.value) || 0
                                                }))}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Sponsor Balance ($)</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={editUserBalance.sponsor_balance}
                                                onChange={(e) => setEditUserBalance(prev => ({
                                                    ...prev,
                                                    sponsor_balance: parseFloat(e.target.value) || 0
                                                }))}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleBalanceUpdate(editingUser.id)}
                                            >
                                                Save Changes
                                            </button>
                                            <button 
                                                className="btn"
                                                onClick={() => setEditingUser(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Site Content Tab */}
                    {activeTab === 'content' && (
                        <div>
                            {siteContent.map(content => (
                                <div key={content.id} className="card" style={{ marginBottom: '1rem' }}>
                                    {editingContent === content.id ? (
                                        <div>
                                            <div className="form-group">
                                                <label className="form-label">Content</label>
                                                <textarea
                                                    className="form-input"
                                                    value={content.content}
                                                    onChange={(e) => setSiteContent(prev => 
                                                        prev.map(c => c.id === content.id ? 
                                                            { ...c, content: e.target.value } : c
                                                        )
                                                    )}
                                                    rows="4"
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button 
                                                    className="btn btn-primary"
                                                    onClick={() => handleContentUpdate(content.id, content)}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    className="btn"
                                                    onClick={() => setEditingContent(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h3>{content.page} - {content.section}</h3>
                                                <p style={{ color: '#666' }}>Type: {content.type}</p>
                                            </div>
                                            <p style={{ marginBottom: '1rem' }}>{content.content}</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => setEditingContent(content.id)}
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
