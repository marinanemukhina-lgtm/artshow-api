const fetch = require('node-fetch');
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const {amount, currency, description, customer, returnurlsuccess} = req.body;
    const auth = Buffer.from('1292552:live_d7_bRrO1W9_FnuzMCkjm-6LIhAzFen5X-81tu6uWA3U').toString('base64');
    const key = Date.now() + '-' + Math.random().toString(36).slice(2);
    const r = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':'Basic '+auth,'Idempotence-Key':key},
      body: JSON.stringify({
        amount: {value: String(Number(amount).toFixed(2)), currency: 'RUB'},
        capture: true,
        confirmation: {type: 'redirect', return_url: returnurlsuccess || 'https://artshow-2026.web.app/success.html'},
        description: description || 'Билет ARTSHOW 555',
        metadata: customer || {}
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({error: data.description || 'Ошибка'});
    return res.json({paymentid: data.id, confirmationurl: data.confirmation.confirmation_url});
  } catch(e) { return res.status(500).json({error: e.message}); }
};
