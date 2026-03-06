const fetch = require('node-fetch');
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const event = req.body;
    if (!event || !event.object) return res.status(400).json({error: 'Bad request'});
    const payment = event.object;
    const status = payment.status;
    const amount = payment.amount ? payment.amount.value : '';
    const desc = payment.description || '';
    const meta = payment.metadata || {};
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    const msg = `\u{1F4B3} ЮKassa webhook\nСтатус: ${status}\nСумма: ${amount} RUB\nОписание: ${desc}\nМетаданные: ${JSON.stringify(meta)}`;
    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: CHAT_ID, text: msg})
      });
    }
    return res.status(200).json({ok: true});
  } catch(e) { return res.status(500).json({error: e.message}); }
};
