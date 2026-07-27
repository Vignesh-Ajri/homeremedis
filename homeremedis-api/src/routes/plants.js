const express = require('express');
const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const Remedy = require('../models/Remedy');

const router = express.Router();

// GET /api/plants
router.get('/', async (req, res) => {
  try {
    const { search, origin, limit = 10, page = 1, sort = 'name' } = req.query;
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (origin) {
      query.countryOfOrigin = { $regex: origin, $options: 'i' };
    }

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const skip = (parsedPage - 1) * parsedLimit;

    const plants = await Plant.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit);

    const total = await Plant.countDocuments(query);

    res.json({
      data: plants,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// GET /api/plants/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Plant ID format' });
    }

    const plant = await Plant.findById(id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Get linked remedies
    const remedies = await Remedy.find({ plantIds: id });

    res.json({
      plant,
      remedies
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

const adminAuth = require('../middleware/admin');

// POST /api/plants (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const plant = new Plant(req.body);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
});

// PUT /api/plants/:id (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Plant ID format' });
    }
    const plant = await Plant.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
});

// DELETE /api/plants/:id (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Plant ID format' });
    }
    const plant = await Plant.findByIdAndDelete(id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    // Optionally delete links from remedies (or just leave them depending on requirements)
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
