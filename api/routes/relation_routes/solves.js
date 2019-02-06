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
    console.log('here')
    // const total = await Solve.aggregate([
    //     { $match: req.params.id },
    //     { $group: { _id: "$status", count: { $sum: 1 } } }
    // ]).exec();

    // const completedJobs = await Solve.find({ technicianId: req.params.technicianId, status: "complete" }).populate('jobId')
    // console.log(completedJobs)
    // res.json({
    //     completedJobs: completedJobs
    // })
    var complete;
    var incomplete;
console.log(req.params.technicianId)
    Solve.find({ technicianId: req.params.technicianId ,status:"complete"},
        (err, result) => {
            if (!result) {
                // return res.status(404).json({ status: false, message: 'User record not found.' });
                console.log('err')
            }
            else {
                Solve.find({ technicianId: req.params.technicianId ,status:"incomplete"},
                (err, resultin) => {
                    if (!resultin) {
                        // return res.status(404).json({ status: false, message: 'User record not found.' });
                        console.log('err')
                    }
                    else {
                        incomplete=result.length
                        let rate=result.length/(result.length+resultin.length)*100;
                        return res.status(404).json({ status: true,rate:Math.round(rate * 100) / 100});
                    }
                }
            );
            }
        }
    );
    
    console.log(complete)
    
})

module.exports = router;