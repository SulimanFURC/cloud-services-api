const apiKeyValidator = (req, res, next) => {
    // Basic check for suspicious payload size (anti-abuse)
    if (req.headers['content-length'] && Number(req.headers['content-length']) > 4096) {
        return res.status(413).json({ error: 'Payload too large.' });
    }
    // Optionally, add more checks (e.g., block requests with certain user agents, etc.)
    next();
};

export default apiKeyValidator;