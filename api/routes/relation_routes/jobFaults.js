const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/JobFault');
const JobFault = mongoose.model('jobFaults');

//set Job Fault
router.post('/', async (req, res) => {
    const existingJobFault = await JobFault.findOne({ jobId: req.body.jobId, faultId: req.body.faultId })

    if (existingJobFault) {
        res.json({
            success: false,
            message: "Already set fault"
        })
        return
    }
    const jobFault = new JobFault({
        jobId: req.body.jobId,
        faultId: req.body.faultId
    })
    await jobFault.save()
        .then(() => res.json({
            success: true,
            message: "Set fault!"
        })
        )
})

//get Faults In A Job
// router.get('/:jobId', async (req, res) => {
//     const faultsInAJob = await JobFault.find({jobId: req.params.jobId}).populate('faultId')
//     res.json({
//         faultsInAJob: faultsInAJob
//     })
// })

//get Faults In A Job
router.get('/:jobId', function(req, res) {
    console.log('Get all job details');
    JobFault.find({jobId: req.params.jobId}) 
    .populate('faultId')
    .exec(function(err,jobFaults){
        if(err){
            console.log("Error");
        } else {
            res.json(jobFaults);
        }
    });
  }); 


module.exports = router;