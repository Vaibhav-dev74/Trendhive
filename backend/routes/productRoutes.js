import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';
import { protect, adminOrShopkeeper } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new product
// @route   POST /api/products
// @access  Private, Admin or Shopkeeper
router.post('/', protect, adminOrShopkeeper, asyncHandler(async (req, res) => {
    const { name, image, price, description, countInStock, category, brand } = req.body;

    const product = new Product({
        user: req.user._id,
        shopName: req.user.shopName || req.user.name,
        name,
        image,
        price,
        description,
        countInStock: countInStock || 0,
        category: category || 'General',
        brand: brand || 'Generic',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('user', 'name email shopName isShopkeeper');
    res.json(products);
}));

// @desc    Get featured products (must be defined before /:id)
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
    const products = await Product.find({}).limit(8);
    res.json(products);
}));

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('user', 'name email shopName isShopkeeper address shopAddress');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private, Admin or Shopkeeper
router.put('/:id', protect, adminOrShopkeeper, asyncHandler(async (req, res) => {
    const { name, image, price, description, countInStock, category, brand } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name ?? product.name;
        product.image = image ?? product.image;
        product.price = price ?? product.price;
        product.description = description ?? product.description;
        product.countInStock = countInStock ?? product.countInStock;
        product.category = category ?? product.category;
        product.brand = brand ?? product.brand;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private, Admin or Shopkeeper
router.delete('/:id', protect, adminOrShopkeeper, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

export default router;
