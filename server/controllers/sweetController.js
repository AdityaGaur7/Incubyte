const Sweet = require('../models/Sweet');

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Protected
const getSweets = async (req, res) => {
    const sweets = await Sweet.find({});
    res.json(sweets);
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Protected
const searchSweets = async (req, res) => {
    const { query, minPrice, maxPrice, category } = req.query;

    let searchCriteria = {};

    if (query) {
        searchCriteria.$or = [
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
        ];
    }

    if (category && category !== 'All') {
        searchCriteria.category = category;
    }

    if (minPrice || maxPrice) {
        searchCriteria.price = {};
        if (minPrice) searchCriteria.price.$gte = Number(minPrice);
        if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(searchCriteria);
    res.json(sweets);
};

// @desc    Create a sweet
// @route   POST /api/sweets
// @access  Private/Admin
const createSweet = async (req, res) => {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    if (!name || !category || !price || quantity === undefined) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const sweet = new Sweet({
        name,
        category,
        price,
        quantity,
        description,
        imageUrl,
    });

    const createdSweet = await sweet.save();
    res.status(201).json(createdSweet);
};

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
const updateSweet = async (req, res) => {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
        sweet.name = name || sweet.name;
        sweet.category = category || sweet.category;
        sweet.price = price || sweet.price;
        sweet.quantity = quantity !== undefined ? quantity : sweet.quantity;
        sweet.description = description || sweet.description;
        sweet.imageUrl = imageUrl || sweet.imageUrl;

        const updatedSweet = await sweet.save();
        res.json(updatedSweet);
    } else {
        res.status(404).json({ message: 'Sweet not found' });
    }
};

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
const deleteSweet = async (req, res) => {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
        await sweet.deleteOne();
        res.json({ message: 'Sweet removed' });
    } else {
        res.status(404).json({ message: 'Sweet not found' });
    }
};

// @desc    Purchase a sweet
// @route   POST /api/sweets/:id/purchase
// @access  Protected
const purchaseSweet = async (req, res) => {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
        if (sweet.quantity > 0) {
            sweet.quantity -= 1;
            const updatedSweet = await sweet.save();
            res.json(updatedSweet);
        } else {
            res.status(400).json({ message: 'Sweet out of stock' });
        }
    } else {
        res.status(404).json({ message: 'Sweet not found' });
    }
};

// @desc    Restock a sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
const restockSweet = async (req, res) => {
    const sweet = await Sweet.findById(req.params.id);

    if (sweet) {
        sweet.quantity += 1;
        const updatedSweet = await sweet.save();
        res.json(updatedSweet);
    } else {
        res.status(404).json({ message: 'Sweet not found' });
    }
};

module.exports = {
    getSweets,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
};
