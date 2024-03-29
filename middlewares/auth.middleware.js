const jwt = require("jsonwebtoken");

// Token verification middle-ware
const AUTH_MW = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send({error: 'Access denied'});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        res.status(400).send({error: 'Invalid token'});
        throw new Error(error);
    }
}

// Export middle-ware
module.exports = AUTH_MW;