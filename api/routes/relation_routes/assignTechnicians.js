const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/AssignTechnician');
const AssignTechnician = mongoose.model('assignTechnicians');

require('../../models/Job');
const Job = mongoose.model('jobs');

require('../../models/relationships/Solve');
const Solve = mongoose.model('solves');

require('../../models/Employee');
const Employee = mongoose.model('employees');

//set Assign Technician
router.post('/', async (req, res) => {
    const existingAssignTechnician = await AssignTechnician.findOne({ jobId: req.body.jobId, technicianId: req.body.technicianId })

    if (existingAssignTechnician) {
        res.json({
            success: false,
            message: "Technician Assign already"
        })
        return
    }
    const assignTechnician = new AssignTechnician({
        jobId: req.body.jobId,
        technicianId: req.body.technicianId
    })
    await assignTechnician.save()
        .then(() => res.json({
            success: true,
            message: "Technician Assigned!"
        })
        )
})

//get Assign Technician Details
// router.get('/technician/:technicianId', async (req, res) => {
//     const assignTechnicianJobs = await AssignTechnician.find({technicianId: req.params.technicianId}).populate('jobId')
//     res.json({
//         assignTechnicianJobs: assignTechnicianJobs
//     })
// })


//get job details group by month
router.get('/technician/:technicianId', function (req, res) {

    //console.log(req.params.technicianId);

    // Job.find({"technicianId":req.params.machineId}) 


    Job.aggregate([
        {
            // $group: {
            //     _id: { $substr: ['$date', 0, 7] },
            //     numberofbookings: { $sum: 1 }
            // }
                $group: {
                       _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                       numberofbookings: {$sum: 1}
                }

        },
        // { $match : {"assignEngineerId" : mongoose.Types.ObjectId(req.params.technicianId) }}
    ])
        .exec(function (err, job) {
            if (err) {
                console.log("Error");
            } else {
                console.log(job);

                job.sort((el1, el2) => {
                    if (el1._id < el2._id) {
                        return -1;
                    }
                })

                var dayJobs =[];
                var tempArr = [];

                job.forEach(element => {
                    console.log(element);
                    //element.date = parseInt(element._id).split('-')[2];
                    element.year = parseInt(element._id.split('-')[0]);
                    element.month = parseInt(element._id.split('-')[1]);

                    var t = tempArr.find(el => el.year == element.year 
                        
                    )

                    if (!t) {
                        tempArr.push({
                            year: element.year,
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           // DayData:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        })
                    }

                    tempArr.find(el => el.year == element.year).data[element.month - 1] = tempArr.find(el => el.year == element.year).data[element.month - 1] + element.numberofbookings;
                    //tempArr.find(el => el.month == element.month).data[element.date - 1] = tempArr.find(el => el.month == element.month).data[element.date - 1] + element.numberofbookings;
                });

                res.json({
                    // jobs : job,
                    data: tempArr
                });
            }
        });
});

//get job details group by date

/*
router.get('/technician/:technicianId', function(req, res) {

  console.log('Get a job details');

  // Job.find({"technicianId":req.params.machineId}) 
   

  Job.aggregate([
      {
          $group: {
          _id: {$substr: ['$date', 0, 10]}, 
          numberofbookings: {$sum: 1}
      }
  }
  ])
  .exec(function(err,job){
      if(err){
          console.log("Error");
      } else {
          console.log(job);

          job.sort((el1, el2) => {
              if(el1._id < el2._id)
              {
                  return -1;
              }                  
          })
          
          var tempArr = [[0,0,0,0,0,0,0,0,0,0,0,0]];
          job.forEach(element => {
              
          });
          res.json({
              jobs : job,
              //data : tempArr
          }); 
      }   
  });
});*/


//get job details group by month
router.get('/solve/:month', function (req, res) {

    Solve.aggregate([
        {
            $group:
                {
                    _id: { "technicianId": "$technicianId", "status": "$status", "startTime" : "$startTime" },
                    noOfData: { $sum: 1 }
                }                
            },
            {
                $lookup:
                {
                    from: "employees",
                    localField:  "_id.technicianId",
                    foreignField: "_id",
                    as: "data"
                    
                }
            }
            // { $match : {"startDate" : mongoose.Types.ObjectId(req.params.month) }}

    ])
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);

                // data.sort((el1, el2) => {
                //     if (el1._id < el2._id) {
                //         return -1;
                //     }
                // })

                // var tempArr = [];

                // data.forEach(element => {
                //     element.year = parseInt(element._id.split('-')[0]);
                //     element.month = parseInt(element._id.split('-')[1]);

                //     var t = tempArr.find(el => el.year == element.year)

                //     if (!t) {
                //         tempArr.push({
                //             year: element.year,
                //             data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                //         })
                //     }

                //     tempArr.find(el => el.year == element.year).data[element.month - 1] = tempArr.find(el => el.year == element.year).data[element.month - 1] + element.numberofbookings;
                // });

                res.json({
                    // jobs : job,
                    data: data
                });
            }
        });
});

//get Assign Technician in a job
router.get('/job/:jobId', async (req, res) => {
    const assignTechnicians = await AssignTechnician.find({ jobId: req.params.jobId }).populate('technicianId')
    res.json({
        assignTechnicians: assignTechnicians
    })

    /*
    if (assignTechnicians) {

    } else {
        res.json({
            message: "Pending"
        })
    }*/
})

module.exports = router;