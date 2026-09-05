CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  hand TEXT,
  shanten INTEGER,
  melds INTEGER,
  taatsu INTEGER,
  has_pair BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

