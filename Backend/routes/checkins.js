const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const CheckIn = require('../models/CheckIn');

// Get all check-ins for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const checkins = await CheckIn.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(checkins);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Save a new emotion result (From the Emotion Journey)
router.post('/', auth, async (req, res) => {
  try {
    const { emotion, intensity } = req.body;
    const newCheckIn = new CheckIn({
      userId: req.user.id,
      emotion,
      intensity
    });
    await newCheckIn.save();
    res.json(newCheckIn);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const checkins = await CheckIn.find({ userId: req.user.id });

    const total = checkins.length;

    const avgIntensity =
      total > 0
        ? Math.round(
            checkins.reduce((sum, c) => sum + c.intensity, 0) / total
          )
        : 0;

    const last7Days = checkins.filter(
      c => new Date(c.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    res.json({
      totalCheckins: total,
      avgIntensity,
      last7DaysCount: last7Days.length
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;