const express = require('express');

const { pool } = require('./db');

const { calculateShanten } = require('./logic');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('public'));

app.get('/about', (req, res) => {
  res.send('このアプリについて');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello' });
});

app.post('/api/echo', (req, res) => {
  res.json(req.body);
});



app.post('/api/evaluate', async (req, res) => {
  const { hand } = req.body;
  const result = calculateShanten(hand);

  await pool.query(
    'INSERT INTO history (hand, shanten, melds, taatsu, has_pair) VALUES ($1, $2, $3, $4, $5)',
    [JSON.stringify(hand), result.shanten, result.melds, result.taatsu, result.hasPair]
  );

  res.json(result);
});

app.get('/api/history', async (req, res) => {
  const result = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});