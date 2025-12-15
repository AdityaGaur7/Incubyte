const mongoose = require('mongoose');

const sweetSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 0 },
        description: { type: String },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

const Sweet = mongoose.model('Sweet', sweetSchema);

module.exports = Sweet;
