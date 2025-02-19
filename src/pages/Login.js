import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to log in. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to HelpSP</h2>
            
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;
