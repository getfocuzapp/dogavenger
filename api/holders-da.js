module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');

  const API_KEY = 'WGGKBQE5CVG5W78BXCTPKCXYJ72R5ERWJ8';
  const CONTRACT = '0x82ecE2bB9e1f3E0b19aFE141EF61C0745e28c75b';

  // Method 1: BSCScan direct API (most accurate - matches what BSCScan shows)
  try {
    const r = await fetch(
      `https://api.bscscan.com/api?module=token&action=tokenholdercount&contractaddress=${CONTRACT}&apikey=${API_KEY}`
    );
    const d = await r.json();
    console.log('BSCScan response:', JSON.stringify(d));
    if (d.status === '1' && d.result) {
      return res.status(200).json({
        success: true,
        formatted: parseInt(d.result).toLocaleString(),
        source: 'bscscan'
      });
    }
  } catch(e) { console.log('BSCScan error:', e.message); }

  // Method 2: Etherscan v2 with BSC chainid fallback
  try {
    const r = await fetch(
      `https://api.etherscan.io/v2/api?chainid=56&module=token&action=tokenholdercount&contractaddress=${CONTRACT}&apikey=${API_KEY}`
    );
    const d = await r.json();
    console.log('Etherscan v2 response:', JSON.stringify(d));
    if (d.status === '1' && d.result) {
      return res.status(200).json({
        success: true,
        formatted: parseInt(d.result).toLocaleString(),
        source: 'etherscan-v2'
      });
    }
    return res.status(200).json({ success: false, raw: d });
  } catch(e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};
