import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

// ✅ Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// ✅ Middleware for admin access
const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

// ✅ Middleware for admin or shopkeeper access
const adminOrShopkeeper = (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user.isShopkeeper || req.user.role === 'shopkeeper' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin or shopkeeper');
    }
};

export { protect, admin, adminOrShopkeeper };
