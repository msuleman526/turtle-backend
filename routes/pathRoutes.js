const express = require('express');
const router = express.Router();
const Path = require('../models/Path');

// DELETE all paths (for cleanup/reset)
router.delete('/paths/all/cleanup', async (req, res) => {
  try {
    const result = await Path.deleteMany({});
    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} paths`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all paths
router.get('/paths', async (req, res) => {
  try {
    const paths = await Path.find().sort({ createdAt: -1 });
    res.json({ success: true, data: paths });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single path by ID
router.get('/paths/:id', async (req, res) => {
  try {
    const path = await Path.findById(req.params.id);
    if (!path) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }
    res.json({ success: true, data: path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new path (with optional initial locations)
router.post('/paths', async (req, res) => {
  try {
    const { name, locations } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Path name is required' });
    }

    // If locations provided, add order to each
    let orderedLocations = [];
    if (locations && Array.isArray(locations)) {
      orderedLocations = locations.map((loc, index) => ({
        lat: loc.lat,
        lng: loc.lng,
        order: loc.order !== undefined ? loc.order : index
      }));
    }

    const newPath = new Path({
      name,
      locations: orderedLocations
    });

    const savedPath = await newPath.save();
    res.status(201).json({ success: true, data: savedPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update path name
router.put('/paths/:id', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Path name is required' });
    }

    const updatedPath = await Path.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedPath) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }

    res.json({ success: true, data: updatedPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE path
router.delete('/paths/:id', async (req, res) => {
  try {
    const deletedPath = await Path.findByIdAndDelete(req.params.id);
    
    if (!deletedPath) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }

    res.json({ success: true, message: 'Path deleted successfully', data: deletedPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add new location to path
router.post('/paths/:id/locations', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const path = await Path.findById(req.params.id);
    
    if (!path) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }

    // Add new location with next order number
    const newOrder = path.locations.length;
    path.locations.push({
      lat,
      lng,
      order: newOrder
    });

    await path.save();
    res.json({ success: true, data: path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update specific location coordinates (for drag & drop)
router.put('/paths/:id/locations/:locationId', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const path = await Path.findById(req.params.id);
    
    if (!path) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }

    const location = path.locations.id(req.params.locationId);
    
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    location.lat = lat;
    location.lng = lng;

    await path.save();
    res.json({ success: true, data: path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE specific location from path
router.delete('/paths/:id/locations/:locationId', async (req, res) => {
  try {
    const path = await Path.findById(req.params.id);
    
    if (!path) {
      return res.status(404).json({ success: false, message: 'Path not found' });
    }

    const location = path.locations.id(req.params.locationId);
    
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    // Remove the location
    location.deleteOne();

    // Reorder remaining locations
    path.locations.forEach((loc, index) => {
      loc.order = index;
    });

    await path.save();
    res.json({ success: true, data: path, message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
