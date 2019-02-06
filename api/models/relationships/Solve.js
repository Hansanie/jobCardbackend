const mongoose = require('mongoose');

const SolveSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
    startTime: { type: Date, required: false },
    endtTime: { type: Date, required: false },
    status: { type: String, default: "incomplete" },
    mark: { type: Date, required: false }
});
 
mongoose.model('solves', SolveSchema);