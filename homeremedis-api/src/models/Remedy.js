const mongoose = require('mongoose');

const remedySchema = new mongoose.Schema({
  title: { type: String, required: true },
  categories: [{ type: String }],
  plantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }],
  ingredients: [{ type: String }],
  method: { type: String, required: true },
  prepTimeMinutes: { type: Number, required: true },
  origin: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Remedy', remedySchema);
