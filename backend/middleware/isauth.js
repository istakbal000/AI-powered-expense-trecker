const jwt = require('jsonwebtoken');

const isauth = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE CHECK ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Cookies received:', req.cookies);
    console.log('Token from cookies:', req.cookies ? req.cookies.token : 'No cookies');
    
    try {
        const token = req.cookies.token;
        
        if (!token) {
            console.log('❌ No token found in cookies');
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
