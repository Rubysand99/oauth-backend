const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('ok'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/oauth/callback', async (req, res) => {
  const code = req.body && req.body.code;
  if (!code) return res.status(400).json({ error: 'missing code' });
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      }),
    });
    const data = await r.json();
    if (!data.access_token) return res.status(400).json(data);
    res.json({ access_token: data.access_token });
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('running'));
