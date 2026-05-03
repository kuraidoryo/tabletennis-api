const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const auth = require('../middleware/auth');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildPlayingStyleRegex = (value) => {
  const normalized = value.trim();
  const escaped = escapeRegex(normalized);

  if (/^offensive$/i.test(normalized)) return /^offensive/i;
  if (/^defensive$/i.test(normalized)) return /(defensive|defender)/i;

  return new RegExp(escaped, 'i');
};

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.handedness) filter.handedness = req.query.handedness;
    if (req.query.grip) filter.grip = req.query.grip;

    if (req.query.firstName) {
      filter.firstName = { $regex: new RegExp(escapeRegex(req.query.firstName.trim()), 'i') };
    }
    if (req.query.lastName) {
      filter.lastName = { $regex: new RegExp(escapeRegex(req.query.lastName.trim()), 'i') };
    }

    if (req.query.playingStyle) {
      filter.playingStyle = { $regex: buildPlayingStyleRegex(req.query.playingStyle) };
    }

    const players = await Player.find(filter).sort({ lastName: 1 });

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const isArray = Array.isArray(req.body);
    
    if (isArray) {
      const players = await Player.insertMany(req.body, { runValidators: true });
      res.status(201).json({
        success: true,
        message: `Added ${players.length} players`,
        data: players
      });
    } else {
      const player = await Player.create(req.body);
      res.status(201).json({ success: true, data: player });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    res.json({ success: true, message: `Player ${player.firstName} ${player.lastName} deleted successfully` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
