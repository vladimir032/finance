-- Users table

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS site_content;
DROP TABLE IF EXISTS transactions;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sponsors table
CREATE TABLE sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    type VARCHAR(50),
    approved_applications INTEGER DEFAULT 0,
    total_funded DECIMAL(10,2) DEFAULT 0
);

-- Reviews table
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Wallets table
CREATE TABLE wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    personal_balance DECIMAL(10,2) DEFAULT 0,
    sponsor_balance DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cards table
CREATE TABLE cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    card_number VARCHAR(16),
    expiry_date VARCHAR(5),
    card_holder VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    network VARCHAR(50),
    wallet_address VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    commission DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Site Content table
CREATE TABLE site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'text'
);
