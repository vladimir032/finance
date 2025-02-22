import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('info');
    
    // Card form state
    const [cardData, setCardData] = useState({
        card_number: '',
        expiry_date: '',
        card_holder: ''
    });

    // Deposit form state
    const [depositData, setDepositData] = useState({
        currency: 'USDT',
        network: '',
        amount: ''
    });

    // Withdrawal form state
    const [withdrawalData, setWithdrawalData] = useState({
        method: 'card',
        currency: 'USDT',
        network: '',
        wallet_address: '',
        amount: '',
        card_id: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://server-production-20ac.up.railway.app/api/profile');

            setProfile(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching profile data');
            setLoading(false);
        }
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();
        
        // Validate card number (only digits, 16 characters)
        if (!/^\d{16}$/.test(cardData.card_number)) {
            setError('Invalid card number (must be 16 digits)');
            return;
        }

        // Validate expiry date format
        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry_date)) {
            setError('Invalid expiry date format (MM/YY)');
            return;
        }

        // Validate month and year
        const month = parseInt(cardData.expiry_date.substring(0, 2));
        const year = parseInt('20' + cardData.expiry_date.substring(3, 5));
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (month < 1 || month > 12) {
            setError('Invalid month (must be 01-12)');
            return;
        }

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setError('Card has expired');
            return;
        }

        // Validate card holder name (not empty and only letters, spaces)
        if (!/^[A-Za-z\s]+$/.test(cardData.card_holder)) {
            setError('Invalid card holder name (only letters and spaces allowed)');
            return;
        }

        // Proceed with submission if validation passes
        try {
            const response = await axios.post('https://server-production-20ac.up.railway.app/api/cards', cardData);

            console.log('Card added:', response.data);
            
            // Fetch updated profile data immediately after adding the card
            await fetchProfile();
            setCardData({
                card_number: '',
                expiry_date: '',
                card_holder: ''
            });
            setError('Card added successfully!');
            setTimeout(() => setError(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Error adding card:', error.response?.data || error.message);
            setError(error.response?.data?.error || 'Error adding card');
        }
    };

    const handleDepositSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://server-production-20ac.up.railway.app/api/transactions/deposit', depositData);

            fetchProfile();
            setDepositData({
                currency: 'USDT',
                network: '',
                amount: ''
            });
            setError('Deposit initiated successfully!');
            setTimeout(() => setError(''), 3000);
        } catch (error) {
            setError('Error initiating deposit');
        }
    };

    const handleWithdrawalSubmit = async (e) => {
        e.preventDefault();
        try {
            const amount = parseFloat(withdrawalData.amount);
            const commission = withdrawalData.method === 'card' ? amount * 0.03 : amount * 0.01;
            const totalAmount = amount + commission;

            if (totalAmount > profile.wallet.personal_balance) {
                setError(`Insufficient funds. You need $${totalAmount.toFixed(2)} (including $${commission.toFixed(2)} commission) but your balance is $${profile.wallet.personal_balance.toFixed(2)}`);
                return;
            }

            if (!window.confirm(`Withdrawal commission will be $${commission.toFixed(2)}. Do you agree?`)) {
                return;
            }
            
            await axios.post('https://server-production-20ac.up.railway.app/api/transactions/withdraw', withdrawalData);

            fetchProfile();
            setWithdrawalData({
                method: 'card',
                currency: 'USDT',
                network: '',
                wallet_address: '',
                amount: '',
                card_id: ''
            });
            setError('Withdrawal initiated successfully!');
            setTimeout(() => setError(''), 3000);
        } catch (error) {
            setError('Error initiating withdrawal');
        }
    };

    const getNetworkOptions = (currency) => {
        switch (currency) {
            case 'USDT':
                return ['TRON (TRC-20)', 'BNB (BEP20)', 'MATIC'];
            case 'BTC':
                return ['BTC'];
            case 'ETH':
                return ['ETH'];
            default:
                return [];
        }
    };

    const getWalletAddress = (currency, network) => {
        const addresses = {
            'TRON (TRC-20)': 'TMEsUtqRqoqFQtJiziTq8bBeRT1mXoVyH2',
            'BNB (BEP20)': '0x30f7f91409c1f76f398179c7cd9d1e247fcb1785',
            'MATIC': '0x30f7f91409c1f76f398179c7cd9d1e247fcb1785',
            'BTC': '1EWoJVFHueR8jsYsH4BzYbAzR5FgTvduBT'
        };
        return addresses[network] || '';
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>

            {error && (
                <div 
                    className={`alert ${error.includes('successfully') ? 'alert-success' : 'alert-error'}`} 
                    style={{ marginBottom: '1rem' }}
                >
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <h3>Wallet Balance</h3>
                            <p>Personal: ${profile?.wallet?.personal_balance.toLocaleString()}</p>
                            <p>Sponsor: ${profile?.wallet?.sponsor_balance.toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p>Email: {user.email}</p>
                            <p>Account Type: {user.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button 
                        className={`btn ${activeTab === 'info' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Account Info
                    </button>
                    <button 
                        className={`btn ${activeTab === 'cards' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('cards')}
                    >
                        Cards
                    </button>
                    <button 
                        className={`btn ${activeTab === 'deposit' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('deposit')}
                    >
                        Deposit
                    </button>
                    <button 
                        className={`btn ${activeTab === 'withdraw' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('withdraw')}
                    >
                        Withdraw
                    </button>
                </div>

                {activeTab === 'info' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Recent Transactions</h3>
                        {profile?.transactions?.length > 0 ? (
                            profile.transactions.map(transaction => (
                                <div key={transaction.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{transaction.type}</span>
                                        <span>${transaction.amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                        <span>{transaction.currency} - {transaction.network}</span>
                                        <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <span className={`badge badge-${transaction.status}`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No transactions found</p>
                        )}
                    </div>
                )}

                {activeTab === 'cards' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Add New Card</h3>
                        <form onSubmit={handleCardSubmit}>
                            <div className="form-group">
                                <label className="form-label">Card Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={cardData.card_number}
                                    onChange={(e) => setCardData(prev => ({ ...prev, card_number: e.target.value }))}
                                    required
                                    maxLength="16"
                                    pattern="\d{16}"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expiry Date (MM/YY)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={cardData.expiry_date}
                                    required
                                    maxLength="5"
                                    placeholder="MM/YY"
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        // Only allow digits and a single forward slash
                                        value = value.replace(/[^\d/]/g, '');
                                        
                                        // Auto-format the expiry date
                                        if (value.length === 2 && !value.includes('/')) {
                                            value += '/';
                                        }
                                        
                                        // Validate month and year
                                        if (value.length >= 2) {
                                            const month = parseInt(value.substring(0, 2));
                                            if (month < 1 || month > 12) {
                                                setError('Invalid month (must be 01-12)');
                                                return;
                                            }
                                            
                                            if (value.length === 5) {
                                                const year = parseInt('20' + value.substring(3, 5));
                                                const currentYear = new Date().getFullYear();
                                                const currentMonth = new Date().getMonth() + 1;
                                                
                                                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                                                    setError('Card has expired');
                                                    return;
                                                }
                                            }
                                        }
                                        
                                        // Clear error if valid
                                        setError('');
                                        
                                        setCardData(prev => ({ ...prev, expiry_date: value }));
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Card Holder Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={cardData.card_holder}
                                    onChange={(e) => setCardData(prev => ({ ...prev, card_holder: e.target.value }))}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Add Card</button>
                        </form>

                        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Saved Cards</h3>
                        {profile?.cards?.length > 0 ? (
                            profile.cards.map(card => (
                                <div key={card.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>**** **** **** {card.card_number.slice(-4)}</span>
                                        <span>{card.expiry_date}</span>
                                    </div>
                                    <div style={{ color: '#666' }}>
                                        {card.card_holder}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No cards saved</p>
                        )}
                    </div>
                )}

                {activeTab === 'deposit' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Deposit Funds</h3>
                        <form onSubmit={handleDepositSubmit}>
                            <div className="form-group">
                                <label className="form-label">Currency</label>
                                <select
                                    className="form-input"
                                    value={depositData.currency}
                                    onChange={(e) => {
                                        setDepositData(prev => ({
                                            ...prev,
                                            currency: e.target.value,
                                            network: ''
                                        }));
                                    }}
                                    required
                                >
                                    <option value="USDT">USDT</option>
                                    <option value="BTC">BTC</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Network</label>
                                <select
                                    className="form-input"
                                    value={depositData.network}
                                    onChange={(e) => setDepositData(prev => ({ ...prev, network: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Network</option>
                                    {getNetworkOptions(depositData.currency).map(network => (
                                        <option key={network} value={network}>{network}</option>
                                    ))}
                                </select>
                            </div>
                            {depositData.network && (
                                <div className="form-group">
                                    <label className="form-label">Wallet Address</label>
                                    <div style={{ 
                                        padding: '1rem',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        wordBreak: 'break-all'
                                    }}>
                                        {getWalletAddress(depositData.currency, depositData.network)}
                                    </div>
                                    <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                        Please send your deposit to this address within 24 hours
                                    </small>
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={depositData.amount}
                                    onChange={(e) => setDepositData(prev => ({ ...prev, amount: e.target.value }))}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Confirm Deposit</button>
                        </form>
                    </div>
                )}

                {activeTab === 'withdraw' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Withdraw Funds</h3>
                        <form onSubmit={handleWithdrawalSubmit}>
                            <div className="form-group">
                                <label className="form-label">Withdrawal Method</label>
                                <select
                                    className="form-input"
                                    value={withdrawalData.method}
                                    onChange={(e) => setWithdrawalData(prev => ({ 
                                        ...prev,
                                        method: e.target.value,
                                        currency: e.target.value === 'card' ? '' : 'USDT',
                                        network: ''
                                    }))}
                                    required
                                >
                                    <option value="card">Bank Card</option>
                                    <option value="crypto">Cryptocurrency</option>
                                </select>
                            </div>

                            {withdrawalData.method === 'card' ? (
                                <div className="form-group">
                                    <label className="form-label">Select Card</label>
                                    <select
                                        className="form-input"
                                        value={withdrawalData.card_id}
                                        onChange={(e) => setWithdrawalData(prev => ({ ...prev, card_id: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select a card</option>
                                        {profile?.cards?.map(card => (
                                            <option key={card.id} value={card.id}>
                                                **** {card.card_number.slice(-4)} - {card.card_holder}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Currency</label>
                                        <select
                                            className="form-input"
                                            value={withdrawalData.currency}
                                            onChange={(e) => setWithdrawalData(prev => ({ 
                                                ...prev,
                                                currency: e.target.value,
                                                network: ''
                                            }))}
                                            required
                                        >
                                            <option value="USDT">USDT</option>
                                            <option value="BTC">BTC</option>
                                            <option value="ETH">ETH</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Network</label>
                                        <select
                                            className="form-input"
                                            value={withdrawalData.network}
                                            onChange={(e) => setWithdrawalData(prev => ({ ...prev, network: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select Network</option>
                                            {getNetworkOptions(withdrawalData.currency).map(network => (
                                                <option key={network} value={network}>{network}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Wallet Address</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={withdrawalData.wallet_address}
                                            onChange={(e) => setWithdrawalData(prev => ({ ...prev, wallet_address: e.target.value }))}
                                            required
                                        />
                                        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                            Please double-check the wallet address before submitting
                                        </small>
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={withdrawalData.amount}
                                    onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                    Commission: {withdrawalData.method === 'card' ? '3%' : '1%'}
                                </small>
                            </div>

                            <button type="submit" className="btn btn-primary">Withdraw Funds</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
