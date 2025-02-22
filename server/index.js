const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'helpsp-secret-key';
const { configDotenv } = require('dotenv');
configDotenv(); // Загрузка переменных окружения из .env файла

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log('✅ Подключено к PostgreSQL'))
    .catch(err => {
        console.error('❌ Ошибка подключения:', err);
        process.exit(1);
    });

module.exports = pool;


// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { email, password, secretKey } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run('INSERT INTO users (email, password, secret_key) VALUES (?, ?, ?)',
            [email, hashedPassword, secretKey],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                
                // Create wallet for new user
                db.run('INSERT INTO wallets (user_id) VALUES (?)', [this.lastID]);
                
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});
app.get('/api/stats', (req, res) => {
    // Example data, replace with actual database queries
    const stats = {
        totalApplications: 100,
        approvedApplications: 75,
        totalSponsors: 10,
        totalFunded: 500000
    };
    res.json(stats);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ token });
    });
});

// Applications Routes
app.post('/api/applications', authenticateToken, (req, res) => {
    const { 
        project_name, project_type, description, 
        first_name, last_name, email, phone, amount 
    } = req.body;
    
    db.run(`
        INSERT INTO applications 
        (user_id, project_name, project_type, description, first_name, last_name, email, phone, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [req.user.id, project_name, project_type, description, first_name, last_name, email, phone, amount],
    (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating application' });
        }
        res.status(201).json({ message: 'Application submitted successfully' });
    });
});

app.get('/api/applications', authenticateToken, (req, res) => {
    if (req.user.role === 'admin') {
        db.all('SELECT * FROM applications ORDER BY created_at DESC', (err, applications) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching applications' });
            }
            res.json(applications);
        });
    } else {
        db.all('SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id],
            (err, applications) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching applications' });
                }
                res.json(applications);
            }
        );
    }
});

// Reviews Routes
app.post('/api/reviews', authenticateToken, (req, res) => {
    const { rating, comment } = req.body;
    
    db.run('INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)',
        [req.user.id, rating, comment],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error creating review' });
            }
            res.status(201).json({ message: 'Review submitted successfully' });
        }
    );
});

app.get('/api/reviews', (req, res) => {
    db.all(`
        SELECT r.*, u.email as user_email 
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
    `, (err, reviews) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching reviews' });
        }
        res.json(reviews);
    });
});

// Cards and Transactions Routes
app.post('/api/cards', authenticateToken, (req, res) => {
    const { card_number, expiry_date, card_holder } = req.body;
    
    db.run('INSERT INTO cards (user_id, card_number, expiry_date, card_holder) VALUES (?, ?, ?, ?)',
        [req.user.id, card_number, expiry_date, card_holder],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding card' });
            }
            console.log('Card added successfully for user:', req.user.id);
            res.status(201).json({ message: 'Card added successfully' });
        }
    );
});

app.post('/api/transactions/deposit', authenticateToken, (req, res) => {
    const { currency, network, amount } = req.body;
    
    db.run(`
        INSERT INTO transactions (user_id, type, amount, currency, network, wallet_address, commission)
        VALUES (?, 'deposit', ?, ?, ?, ?, ?)
    `,
    [req.user.id, amount, currency, network, '', 0], // Assuming no commission for deposits
    (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error initiating deposit' });
        }
        res.status(201).json({ message: 'Deposit initiated successfully' });
    });
});

app.post('/api/transactions/withdraw', authenticateToken, (req, res) => {
    const { method, currency, network, wallet_address, amount, card_id } = req.body;
    const commission = method === 'card' ? amount * 0.03 : amount * 0.01;
    
    db.run(`
        INSERT INTO transactions (user_id, type, amount, currency, network, wallet_address, commission)
        VALUES (?, 'withdrawal', ?, ?, ?, ?, ?)
    `,
    [req.user.id, amount, currency, network, wallet_address, commission],
    (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error initiating withdrawal' });
        }
        res.status(201).json({ message: 'Withdrawal initiated successfully' });
    });
});

// Profile Route
app.get('/api/profile', authenticateToken, (req, res) => {
        db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
            console.log('Fetching profile for user:', req.user.id);
        if (err) {
            return res.status(500).json({ error: 'Error fetching profile data' });
        }
        db.get('SELECT * FROM wallets WHERE user_id = ?', [req.user.id], (err, wallet) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching wallet data' });
            }
            db.all('SELECT * FROM transactions WHERE user_id = ?', [req.user.id], (err, transactions) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching transactions' });
                }
                db.all('SELECT * FROM cards WHERE user_id = ?', [req.user.id], (err, cards) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error fetching cards' });
                    }
                    res.json({ user, wallet, transactions, cards });
                });
            });
        });
    });
});

// Admin Routes
app.get('/api/admin/applications', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db.all('SELECT * FROM applications ORDER BY created_at DESC', (err, applications) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching applications' });
        }
        res.json(applications);
    });
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db.all(`
        SELECT u.*, w.personal_balance, w.sponsor_balance 
        FROM users u 
        LEFT JOIN wallets w ON u.id = w.user_id 
        ORDER BY u.created_at DESC
    `, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.json(users);
    });
});

app.get('/api/admin/reviews', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db.all(`
        SELECT r.*, u.email as user_email 
        FROM reviews r 
        LEFT JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
    `, (err, reviews) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching reviews' });
        }
        res.json(reviews);
    });
});

app.get('/api/admin/site-content', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db.all('SELECT * FROM site_content', (err, content) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching site content' });
        }
        res.json(content);
    });
});

app.put('/api/admin/applications/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { status } = req.body;
    db.run('UPDATE applications SET status = ? WHERE id = ?',
        [status, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating application' });
            }
            res.json({ message: 'Application updated successfully' });
        }
    );
});

app.put('/api/admin/reviews/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { rating, comment } = req.body;
    db.run('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating review' });
            }
            res.json({ message: 'Review updated successfully' });
        }
    );
});

app.delete('/api/admin/reviews/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db.run('DELETE FROM reviews WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error deleting review' });
        }
        res.json({ message: 'Review deleted successfully' });
    });
});

// Add balance update endpoint
app.put('/api/admin/users/:id/balance', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { personal_balance, sponsor_balance } = req.body;
    const userId = req.params.id;

    db.run(
        'UPDATE wallets SET personal_balance = ?, sponsor_balance = ? WHERE user_id = ?',
        [personal_balance, sponsor_balance, userId],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating user balance' });
            }
            res.json({ message: 'Balance updated successfully' });
        }
    );
});

app.put('/api/admin/site-content', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { page, section, content, type } = req.body;
    db.run(`
        INSERT OR REPLACE INTO site_content (page, section, content, type)
        VALUES (?, ?, ?, ?)
    `,
    [page, section, content, type],
    (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating site content' });
        }
        res.json({ message: 'Content updated successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });