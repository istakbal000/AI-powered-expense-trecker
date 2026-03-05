const jwt = require('jsonwebtoken');

const isauth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: "Unauthorized - No token provided" 
            });
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        
        if (!decoded || !decoded.id) {
            return res.status(403).json({ 
                success: false,
                error: "Forbidden - Invalid token" 
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(403).json({ 
            success: false,
            error: "Forbidden - Token verification failed" 
        });
    }
};

module.exports = isauth;
