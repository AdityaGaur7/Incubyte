const express = require('express');
const router = express.Router();
const {
    getSweets,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
} = require('../controllers/sweetController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search', protect, searchSweets);

router.route('/')
    .get(protect, getSweets)
    .post(protect, admin, createSweet);

router.route('/:id')
    .put(protect, admin, updateSweet)
    .delete(protect, admin, deleteSweet);

router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

module.exports = router;
