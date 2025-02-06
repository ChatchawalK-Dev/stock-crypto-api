const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');

/**
 * Fetch stock price using Yahoo Finance API
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
const getStockPrice = async (symbol) => {
    try {
        const result = await yahooFinance.quote(symbol);
        if (!result || !result.regularMarketPrice) {
            throw new Error('Stock symbol not found');
        }
        return {
            symbol: result.symbol,
            price: result.regularMarketPrice,
            currency: result.currency
        };
    } catch (error) {
        throw new Error('Error retrieving stock data');
    }
};

/**
 * Fetch crypto price using CoinGecko API
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
const getCryptoPrice = async (symbol) => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
        if (!response.data[symbol]) {
            throw new Error('Crypto symbol not found');
        }
        return {
            symbol: symbol,
            price: response.data[symbol].usd,
            currency: 'USD'
        };
    } catch (error) {
        throw new Error('Error retrieving crypto data');
    }
};

module.exports = { getStockPrice, getCryptoPrice };
