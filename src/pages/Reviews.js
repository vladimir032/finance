import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Reviews = () => {
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('https://server-production-20ac.up.railway.app/api/reviews');

            setReviews(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching reviews');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('https://server-production-20ac.up.railway.app/api/reviews', formData);

            setShowForm(false);
            setFormData({
                rating: 5,
                comment: ''
            });
            fetchReviews();
        } catch (error) {
            setError('Error submitting review');
        }
    };

    const getRatingStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            {/* Reviews Summary */}
            <section className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ marginBottom: '1rem' }}>User Reviews</h2>
                        <div style={{ fontSize: '2.5rem', color: '#f1c40f', marginBottom: '0.5rem' }}>
                            {getRatingStars(Math.round(getAverageRating()))}
                        </div>
                        <p style={{ fontSize: '1.2rem' }}>
                            {getAverageRating()} out of 5
                        </p>
                        <p style={{ color: '#666' }}>
                            Based on {reviews.length} reviews
                        </p>
                    </div>

                    <div style={{ flex: 1, maxWidth: '400px', marginLeft: '2rem' }}>
                        {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
                            <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ width: '30px' }}>{rating}★</div>
                                <div style={{ flex: 1, marginLeft: '1rem', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div 
                                        style={{ 
                                            width: `${(count / reviews.length) * 100}%`,
                                            height: '20px',
                                            backgroundColor: '#f1c40f'
                                        }}
                                    />
                                </div>
                                <div style={{ width: '40px', marginLeft: '1rem', textAlign: 'right' }}>
                                    {count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Write Review Button */}
            {isAuthenticated && (
                <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </button>
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Write a Review</h3>
                    
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Rating</label>
                            <div style={{ fontSize: '2rem', color: '#f1c40f' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {star <= formData.rating ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Comment</label>
                            <textarea
                                className="form-input"
                                value={formData.comment}
                                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                required
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Submit Review
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div>
                {reviews.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No reviews yet. Be the first to write a review!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="card" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ color: '#f1c40f', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                        {getRatingStars(review.rating)}
                                    </div>
                                    <div style={{ color: '#666' }}>
                                        by {review.user_email || 'Anonymous'}
                                    </div>
                                </div>
                                <div style={{ color: '#666' }}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <p>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
