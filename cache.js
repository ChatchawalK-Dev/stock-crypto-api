const cache = new Map();

const set = (key, value, ttl = 300000) => {
    cache.set(key, { value, expiry: Date.now() + ttl });
};

const get = (key) => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
        cache.delete(key);
        return null;
    }
    
    return cached.value;
};

module.exports = { set, get };
