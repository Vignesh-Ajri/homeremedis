const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  countryOfOrigin: { type: String, required: true },
  habitat: { type: String, required: true },
  partsUsed: [{ type: String }],
  activeCompounds: [{ type: String }],
  uses: [{ type: String }],
  imageUrl: { type: String, required: true },
  precautions: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
