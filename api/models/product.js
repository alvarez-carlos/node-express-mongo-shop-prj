    const mongoose = require('mongoose')

    const Product = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        price: { type: Number, required: true },
        productImage: { type: String, equired: true }
    })

    module.exports = mongoose.model('Product', Product)