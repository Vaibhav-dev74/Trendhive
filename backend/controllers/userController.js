import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

// ✅ Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isShopkeeper, shopName, address, shopAddress } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const role = isShopkeeper ? 'shopkeeper' : 'user';

    const user = await User.create({
        name,
        email,
        password,
        role,
        isShopkeeper: !!isShopkeeper,
        shopName: shopName || "",
        address: address || {},
        shopAddress: shopAddress || {},
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isShopkeeper: user.isShopkeeper,
            role: user.role,
            shopName: user.shopName,
            address: user.address,
            shopAddress: user.shopAddress,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// ✅ Customer Login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isShopkeeper: user.isShopkeeper,
            role: user.role,
            shopName: user.shopName,
            address: user.address,
            shopAddress: user.shopAddress,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// ✅ Dedicated Shopkeeper & Admin Login
const adminLoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Verify shopkeeper or admin privileges
    const hasPrivilege = user.isAdmin || user.isShopkeeper || user.role === 'shopkeeper' || user.role === 'admin';
    if (!hasPrivilege) {
        res.status(403);
        throw new Error('Access Denied: This portal is exclusively for registered Shopkeepers and Administrators. Please use the Customer Login.');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isShopkeeper: user.isShopkeeper,
        role: user.role,
        shopName: user.shopName,
        address: user.address,
        shopAddress: user.shopAddress,
        token: generateToken(user._id),
    });
});

// ✅ Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isShopkeeper: user.isShopkeeper,
            role: user.role,
            shopName: user.shopName,
            address: user.address,
            shopAddress: user.shopAddress,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅ Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.shopName !== undefined) {
            user.shopName = req.body.shopName;
        }

        if (req.body.address) {
            user.address = {
                street: req.body.address.street ?? user.address?.street ?? "",
                city: req.body.address.city ?? user.address?.city ?? "",
                state: req.body.address.state ?? user.address?.state ?? "",
                postalCode: req.body.address.postalCode ?? user.address?.postalCode ?? "",
                country: req.body.address.country ?? user.address?.country ?? "India",
                phone: req.body.address.phone ?? user.address?.phone ?? "",
            };
        }

        if (req.body.shopAddress) {
            user.shopAddress = {
                street: req.body.shopAddress.street ?? user.shopAddress?.street ?? "",
                city: req.body.shopAddress.city ?? user.shopAddress?.city ?? "",
                state: req.body.shopAddress.state ?? user.shopAddress?.state ?? "",
                postalCode: req.body.shopAddress.postalCode ?? user.shopAddress?.postalCode ?? "",
                country: req.body.shopAddress.country ?? user.shopAddress?.country ?? "India",
                phone: req.body.shopAddress.phone ?? user.shopAddress?.phone ?? "",
            };
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isShopkeeper: updatedUser.isShopkeeper,
            role: updatedUser.role,
            shopName: updatedUser.shopName,
            address: updatedUser.address,
            shopAddress: updatedUser.shopAddress,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Request password reset code
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
        res.status(404);
        throw new Error('No registered account found with this email address');
    }

    // Generate 6-digit random code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    await user.save();

    res.json({
        success: true,
        message: 'Password reset verification code generated.',
        email: user.email,
        resetCode: resetCode,
    });
});

// @desc    Reset password using verification code
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        res.status(400);
        throw new Error('Please provide email, verification code, and new password');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase(),
        resetPasswordCode: code.trim(),
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification code. Please request a new one.');
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
    });
});

export {
    registerUser,
    loginUser,
    adminLoginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
};
