const express = require('express');
const mongoose = require('mongoose');
const Remedy = require('../models/Remedy');

const router = express.Router();

const ALLOWED_SORT_FIELDS = ['title', '-title', 'prepTimeMinutes', '-prepTimeMinutes', 'createdAt', '-createdAt'];
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/remedies
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1, sort = 'title' } = req.query;
    
    let query = {};
    if (category) {
      query.categories = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
    }

    const safeSort = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'title';
    const parsedLimit = Math.min(parseInt(limit, 10) || 10, 50);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const remedies = await Remedy.find(query)
      .sort(safeSort)
      .skip(skip)
      .limit(parsedLimit);

    const total = await Remedy.countDocuments(query);

    res.json({
      data: remedies,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/remedies/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Remedy ID format' });
    }

    const remedy = await Remedy.findById(id).populate('plantIds');
    if (!remedy) {
      return res.status(404).json({ message: 'Remedy not found' });
    }

    res.json(remedy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const adminAuth = require('../middleware/admin');

// POST /api/remedies (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const remedy = new Remedy(req.body);
    await remedy.save();
    res.status(201).json(remedy);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
});

// PUT /api/remedies/:id (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Remedy ID format' });
    }
    const remedy = await Remedy.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!remedy) {
      return res.status(404).json({ message: 'Remedy not found' });
    }
    res.json(remedy);
  } catch (error) {
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
});

// DELETE /api/remedies/:id (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Remedy ID format' });
    }
    const remedy = await Remedy.findByIdAndDelete(id);
    if (!remedy) {
      return res.status(404).json({ message: 'Remedy not found' });
    }
    res.json({ message: 'Remedy deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
