const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobId: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: false },
    faultImage: { type: String, required: false },
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'machines', required: true },
    createOperatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true },
    assignEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: false }
});

mongoose.model('jobs', JobSchema);