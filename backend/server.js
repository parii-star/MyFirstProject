const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'pass',
  port: process.env.DB_PORT || 5432,
});

app.get('/connect', (req, res) => {
  res.send('backend connected');
});

app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query('INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected');
    // Create table if not exists
    await pool.query(`CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      description TEXT
    )`);
    // Start server
    app.listen(5000, () => {
      console.log('Backend running on port 5000');
    });
  } catch (err) {
    console.error('DB connection failed, retrying...');
    setTimeout(testConnection, 5000);
  }
};

testConnection();