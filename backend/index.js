const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'null') {
      callback(null, true);

    } else if (origin === 'http://localhost:8080') {
      callback(null, true);

    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));


app.use(express.json());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

const initDb = () => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        } else {
          console.log('Users table ready.');

          db.run(`INSERT OR IGNORE INTO users (id, name) VALUES (1, 'Test User')`, (err) => {
            if (err) {
              console.error('Error inserting test user:', err.message);
            } else {
              console.log('Test user inserted.');
            }
            resolve();
          });
        }
      }
    );
  });
};

initDb()
  .then(() => {
    app.get('/', (req, res) => {
      res.send('Hello from the backend!');
    });

    app.get('/users', (req, res) => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          console.error('Error querying users:', err.message);
          res.status(500).json({ error: 'Database error' });
        } else {
          res.json(rows);
        }
      });
    });

    app.listen(port, () => {
      console.log(`Backend listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });