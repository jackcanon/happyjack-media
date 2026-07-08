// api/az-events.js — Vercel serverless CORS proxy for azveterans.com events API
module.exports = async function handler(req, res) {
  const { per_page = 20, page = 1, start_date } = req.query;
  const url = new URL('https://azveterans.com/wp-json/tribe/events/v1/events');
  url.searchParams.set('per_page', String(per_page));
  url.searchParams.set('page', String(page));
  if (start_date) url.searchParams.set('start_date', start_date);
  try {
    const r = await fetch(url.toString(), { headers: { 'User-Agent': 'AZVRC-Events/1.0' } });
    if (!r.ok) throw new Error('upstream ' + r.status);
    const data = await r.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
