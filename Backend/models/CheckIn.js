const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emotion: { type: String, required: true }, // e.g., 'Calm', 'Reflective'
  intensity: { type: Number, required: true }, // 0-100
  note: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);