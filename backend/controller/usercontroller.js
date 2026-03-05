const user = require('../database/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Input validation helper
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2;
};

// Success response helper
const successResponse = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

// Error response helper
const errorResponse = (res, message, statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString()
    });
};

// Register user with validation and security
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!validateName(name)) {
            return errorResponse(res, 'Name must be at least 2 characters long');
        }

        if (!validateEmail(email)) {
            return errorResponse(res, 'Please provide a valid email address');
        }

        if (!validatePassword(password)) {
            return errorResponse(res, 'Password must be at least 6 characters long');
        }

        // Check if user already exists
        const existingUser = await user.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (existingUser) {
            return errorResponse(res, 'User with this email already exists', 409);
        }

        // Hash password with proper salt rounds
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with additional fields
        const newUser = new user({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            profile: {
                currency: 'USD',
                timezone: 'UTC'
            }
        });

        await newUser.save();

        successResponse(res, 'User registered successfully', {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        }, 201);

    } catch (error) {
        console.error('Registration error:', error);
        errorResponse(res, 'Registration failed. Please try again.', 500);
    }
};

// Login user with enhanced security
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!validateEmail(email)) {
            return errorResponse(res, 'Please provide a valid email address');
        }

        if (!password) {
            return errorResponse(res, 'Password is required');
        }

        // Find user with case-insensitive email
        const existingUser = await user.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (!existingUser) {
            return errorResponse(res, 'Invalid email or password', 401);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return errorResponse(res, 'Invalid email or password', 401);
        }

        // Generate JWT with proper expiration
        const token = jwt.sign(
            { 
                id: existingUser._id,
                email: existingUser.email 
            },
            process.env.SECRET_JWT,
            { 
                expiresIn: '24h',
                issuer: 'expense-tracker',
                audience: 'expense-tracker-users'
            }
        );

        // Set secure cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        res.cookie('token', token, cookieOptions);

        successResponse(res, 'Login successful', {
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                profile: existingUser.profile,
                preferences: existingUser.preferences || {
                    budgetAlerts: true,
                    weeklyReports: true,
                    aiInsights: true
                }
            },
            token: process.env.NODE_ENV === 'development' ? token : undefined // Only send token in dev
        });

    } catch (error) {
        console.error('Login error:', error);
        errorResponse(res, 'Login failed. Please try again.', 500);
    }
};

// Logout user with proper cookie handling
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        successResponse(res, 'Logged out successfully');

    } catch (error) {
        console.error('Logout error:', error);
        errorResponse(res, 'Logout failed', 500);
    }
};

// Update user profile with validation
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, currency, timezone, notifications, weeklyReports, aiInsights } = req.body;

        // Validate email if being updated
        if (email && !validateEmail(email)) {
            return errorResponse(res, 'Please provide a valid email address');
        }

        // Check if email is already taken by another user
        if (email) {
            const emailUser = await user.findOne({ 
                email: email.toLowerCase().trim(),
                _id: { $ne: userId }
            });

            if (emailUser) {
                return errorResponse(res, 'Email is already taken by another user', 409);
            }
        }

        const updateData = {
            profile: {
                currency: currency || 'USD',
                timezone: timezone || 'UTC'
            },
            preferences: {
                budgetAlerts: notifications !== undefined ? notifications : true,
                weeklyReports: weeklyReports !== undefined ? weeklyReports : true,
                aiInsights: aiInsights !== undefined ? aiInsights : true
            }
        };

        if (name) updateData.name = name.trim();
        if (email) updateData.email = email.toLowerCase().trim();

        const updatedUser = await user.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        successResponse(res, 'Profile updated successfully', {
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profile: updatedUser.profile,
                preferences: updatedUser.preferences
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        errorResponse(res, 'Failed to update profile', 500);
    }
};

// Update password with security checks
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return errorResponse(res, 'Current password and new password are required');
        }

        if (!validatePassword(newPassword)) {
            return errorResponse(res, 'New password must be at least 6 characters long');
        }

        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return errorResponse(res, 'User not found', 404);
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) {
            return errorResponse(res, 'Current password is incorrect', 401);
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.findByIdAndUpdate(userId, { password: hashedPassword });

        successResponse(res, 'Password updated successfully');

    } catch (error) {
        console.error('Password update error:', error);
        errorResponse(res, 'Failed to update password', 500);
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    updatePassword
};
