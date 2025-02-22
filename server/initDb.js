const path = require('path');
const fs = require('fs');
const { configDotenv } = require('dotenv');
configDotenv(); // Загрузка переменных окружения из .env файла

// Создание директории для базы данных
const dbDir = path.join(__dirname, '../src/database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Подключение к базе данных
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Используем переменную окружения
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // Railway требует SSL
});

pool.connect()
    .then(() => console.log('✅ Подключено к PostgreSQL'))
    .catch(err => {
        console.error('❌ Ошибка подключения к базе данных:', err);
        process.exit(1);
    });

module.exports = pool;


// Читаем схему БД
const schema = fs.readFileSync(path.join(__dirname, '../src/database/schema.sql'), 'utf8');

// Инициализация БД
db.exec(schema, (err) => {
    if (err) {
        console.error('Ошибка при инициализации базы данных:', err);
        process.exit(1);
    }
    console.log('База данных инициализирована');

    // Вставка тестовых данных
    const sampleData = [
        `INSERT INTO users (email, password, secret_key, role) 
         VALUES ('admin125@pisun.com', '$2a$10$Zm5tq7nhKIgWdy8UUc9tpOQxbGPFPwCQjNH3XSAG634CdcSAPcwnC', 'admin-secret', 'admin');`,

        `INSERT INTO sponsors (name, description, type, approved_applications, total_funded) VALUES 
         ('TechVentures Capital', 'A leading venture capital firm focused on early-stage technology startups.', 'Company', 45, 2500000),
         ('Green Innovation Fund', 'Dedicated to funding sustainable and eco-friendly startups.', 'Organization', 32, 1800000),
         ('Sarah Johnson', 'Angel investor with 15 years of experience in supporting early-stage startups.', 'Individual', 28, 900000);`,

        `INSERT INTO site_content (page, section, content, type) VALUES 
         ('home', 'hero', 'Fund Your Startup Dreams', 'text'),
         ('about', 'mission', 'Empowering entrepreneurs and innovators to bring their ideas to life.', 'text');`
    ];

    db.serialize(() => {
        let remainingQueries = sampleData.length + 1; // +1 для запроса на создание кошелька

        const checkCompletion = () => {
            remainingQueries--;
            if (remainingQueries === 0) {
                console.log('Тестовые данные успешно вставлены');
                db.close((err) => {
                    if (err) console.error('Ошибка при закрытии БД:', err);
                    else console.log('Соединение с БД закрыто');
                });
            }
        };

        sampleData.forEach(query => {
            db.run(query, (err) => {
                if (err) {
                    console.error('Ошибка при вставке данных:', err);
                }
                checkCompletion();
            });
        });

        // Создание кошелька для admin
        db.get('SELECT id FROM users WHERE email = ?', ['admin125@pisun.com'], (err, user) => {
            if (err) {
                console.error('Ошибка при получении ID пользователя:', err);
            } else if (user) {
                db.run('INSERT INTO wallets (user_id) VALUES (?)', [user.id], (err) => {
                    if (err) console.error('Ошибка при создании кошелька:', err);
                    checkCompletion();
                });
            } else {
                console.warn('Admin пользователь не найден');
                checkCompletion();
            }
        });
    });
});
