const jwt = require('jsonwebtoken');
const isauth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.SECRET_JWT,(err, user) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

module.exports = isauth;
