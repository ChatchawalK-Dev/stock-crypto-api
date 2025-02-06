const express = require('express');
const cache = require('./cache');
const { getStockPrice, getCryptoPrice } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Check if data exists in the cache
 * @param {string} key 
 * @returns {Object|null}
 */
const getCachedData = (key) => {
    const cachedData = cache.get(key);
    return cachedData ? cachedData : null;
};

// Route for Stock Price
app.get('/api/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase(); 

    try {
        const stockPrice = await getStockPrice(symbol);
        res.json({ fromCache: false, ...stockPrice });
    } catch (err) {
        console.error("Stock API Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Route for Crypto Price
app.get('/api/crypto/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toLowerCase();
    const cachedData = getCachedData(symbol);

    if (cachedData) {
        return res.json({ fromCache: true, ...cachedData });
    }

    try {
        const cryptoPrice = await getCryptoPrice(symbol);
        cache.set(symbol, cryptoPrice);
        res.json({ fromCache: false, ...cryptoPrice });
    } catch (err) {
        console.error("Crypto API Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
