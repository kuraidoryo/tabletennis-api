const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.gender)       filter.gender = req.query.gender;
    if (req.query.handedness)   filter.handedness = req.query.handedness;
    if (req.query.playingStyle) filter.playingStyle = req.query.playingStyle;

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
    const player = await Player.create(req.body);
    res.status(201).json({ success: true, data: player });
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