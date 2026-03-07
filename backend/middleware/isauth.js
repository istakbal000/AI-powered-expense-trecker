const jwt = require('jsonwebtoken');

const isauth = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE CHECK ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Cookies received:', req.cookies);
    console.log('Token from cookies:', req.cookies ? req.cookies.token : 'No cookies');
    
    try {
        // Accept token from Authorization header (Bearer) or cookie
        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('Using token from Authorization header');
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Using token from cookies');
        }

        if (!token) {
            console.log('❌ No token provided in Authorization header or cookies');
            return res.status(401).json({ 
                success: false,
                error: "Unauthorized - No token provided" 
            });
        }

        console.log('Token found, verifying...');
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        console.log('Token verified successfully. Decoded:', decoded);
        
        if (!decoded || !decoded.id) {
            console.log('❌ Invalid token structure');
            return res.status(403).json({ 
                success: false,
                error: "Forbidden - Invalid token" 
            });
        }
        
        req.user = decoded;
        console.log('✅ User authenticated:', req.user);
        next();
    } catch (error) {
        console.error('❌ Authentication error:', error.message);
        console.error('Error stack:', error.stack);
        return res.status(403).json({ 
            success: false,
            error: "Forbidden - Token verification failed: " + error.message 
        });
    }
};

module.exports = isauth;
