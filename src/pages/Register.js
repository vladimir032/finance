import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        // Validate password strength
        if (password.length < 8) {
            return setError('Password must be at least 8 characters long');
        }

        setLoading(true);

        try {
            const result = await register(email, password, secretKey);
            if (result.success) {
                navigate('/login');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to create an account. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
            
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
                        minLength={8}
                    />
                    <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                        Password must be at least 8 characters long
                    </small>
                </div>

                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Secret Key</label>
                    <input
                        type="text"
                        className="form-input"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        required
                    />
                    <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                        This key will be used for account recovery
                    </small>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Important Notes:</h4>
                <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Keep your secret key safe - it's required for account recovery</li>
                    <li>Use a strong password with a mix of letters, numbers, and symbols</li>
                    <li>Never share your login credentials with anyone</li>
                </ul>
            </div>
        </div>
    );
};

export default Register;
