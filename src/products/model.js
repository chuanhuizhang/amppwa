const mongoose = require('mongoose')

const PRODUCT_SCHEMA = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  features: [{ type: String, required: true }],
  categories: [{
    type: String,
    enum: ['Art', 'Pens', 'Classic', 'Collections', 'Highlighters', 'Pro', 'Specialty'],
    required: true
  }],
  subCategories: [String],
  sizes: [String],
  colors: [{
    code: String,
    name: String
  }],
  image: String,
  createdAt: { type: Date, required: true, default: Date.now },
  modifiedAt: { type: Date, required: false },
  deletedAt: { type: Date, required: false }
}, { collection: 'products' })

module.exports = mongoose.model('Product', PRODUCT_SCHEMA)
