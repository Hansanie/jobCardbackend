const mongoose = require('mongoose');

const FaultCategorySchema = new mongoose.Schema({
    faultCategoryName: { type: String, required: true },
    faultCategoryDescription: { type: String, default:'No Description' }
});

mongoose.model('faultcategories', FaultCategorySchema);