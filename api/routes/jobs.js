const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

require('../models/Job');
const Job = mongoose.model('jobs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './fault_images/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() +"_"+ file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

//Register a User
router.post('/', upload.single('faultImage'), async (req, res) => {
    const existingJobId = await Job.findOne({ jobId: req.body.jobId })

    if (existingJobId) {
        res.json({
            success: false,
            message: "Job Id already in use. Please enter another one"
        })
        return
    }

    if (req.file) {
            const job = new Job({
                jobId: req.body.jobId,
                date: req.body.date,
                description: req.body.description,
                faultImage: req.file.path,
                machineId: req.body.machineId,
                createOperatorId: req.body.createOperatorId,
                assignEngineerId: req.body.assignEngineerId
            })
        
            job.save()
            res.json({
                success: true,
                message: "Job is Registered!"
            })
    } else {
            const job = new Job({
                jobId: req.body.jobId,
                date: req.body.date,
                description: req.body.description,
                machineId: req.body.machineId,
                createOperatorId: req.body.createOperatorId,
                assignEngineerId: req.body.assignEngineerId
            })
        
            job.save()
            res.json({
                success: true,
                message: "Job is Registered!"
            })
    }
})

//get a job details
router.get('/:_id', async (req, res) => {
    const aJobDetails = await Job.findById(req.params._id)
    res.json({
        aJobDetails: aJobDetails
    })
})

//get job details
// router.get('/', async (req, res) => {
//     const JobDetails = await Job.find({})
//     res.json({
//         JobDetails: JobDetails
//     })
// })

//get jobs details without
router.get('/', function(req, res) {
    console.log('Get all job details');
    Job.find({}) 
    .exec(function(err,jobs){
        if(err){
            console.log("Error");
        } else {
            res.json(jobs);
        }
    });
  });

//get job details in a machine
// router.get('/job/:machineId', async (req, res) => {
//     const jobDetailsInAMachine = await Job.find({machineId: req.params.machineId})
//     res.json({
//         details: jobDetailsInAMachine
//     })
// })

//get job details of a machine without uning an array
router.get('/job/:machineId', function(req, res) {
    console.log('Get a job details');
    Job.find({"machineId":req.params.machineId}) 
    .exec(function(err,job){
        if(err){
            console.log("Error");
        } else {
            var tempArr = [0,0,0,0,0,0,0,0,0,0,0,0]
            job.forEach(element => {
                var tempDate = new Date(element.date) 
               // console.log(tempDate.getMonth());
                tempArr[tempDate.getMonth()] +=1;
            });
            res.json({
                //jobs : job,
                data : tempArr
            }); 
        }
    });
  });

module.exports = router;