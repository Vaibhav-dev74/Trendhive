import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new product
// @route   POST /api/products
// @access  Private, Admin
router.post('/', protect, asyncHandler(async (req, res) => {
    const { name, image, price, description, countInStock } = req.body;

    const product = new Product({
        name,
        image,
        price,
        description,
        countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private, Admin
router.put('/:id', protect, asyncHandler(async (req, res) => {
    const { name, image, price, description, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.image = image || product.image;
        product.price = price || product.price;
        product.description = description || product.description;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}));


export default router;
