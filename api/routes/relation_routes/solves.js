const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/Solve');
const Solve = mongoose.model('solves');

//set Job Fault
router.post('/', async (req, res) => {
    const existingJobFault = await Solve.findOne({ jobId: req.body.jobId, technicianId: req.body.technicianId })

    if (existingJobFault) {
        res.json({
            success: false,
            message: "Already set job"
        })
        return
    }
    const solve = new Solve({
        jobId: req.body.jobId,
        technicianId: req.body.technicianId,
        startTime: req.body.startTime,
        endtTime: req.body.endtTime,
        status: req.body.status,
        mark: req.body.mark
    })
    await solve.save()
        .then(() => res.json({
            success: true,
            message: "Set job!"
        })
        )
})

//get completed Jobs are done by spec. Technician
router.get('/:technicianId', async (req, res) => {
    const completedJobs = await Solve.find({technicianId: req.params.technicianId, status:"complete"}).populate('jobId')
    res.json({
        completedJobs: completedJobs
    })
})

module.exports = router;