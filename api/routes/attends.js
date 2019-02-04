const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Attend');
const Attend = mongoose.model('attends');

module.exports = router;