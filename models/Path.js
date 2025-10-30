const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const pathSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  locations: [locationSchema]
}, {
  timestamps: true
});

const Path = mongoose.model('Path', pathSchema);

module.exports = Path;
