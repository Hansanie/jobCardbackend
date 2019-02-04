const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/EmployeeType');
const EmployeeType = mongoose.model('employeeTypes');

require('../models/Employee');
const Employee = mongoose.model('employees');

//check user type is taken
router.get('/check/:employeeTypeName', async (req, res) => {
    const unique = await EmployeeType.findOne({ userTypeId: req.params.employeeTypeName })
    if (unique) {
        res.json({
            unique: true
        })
    } else {
        res.json({
            unique: false
        })
    }
})

//add userType
router.post('/', async (req, res) => {
    const existingEmployeeType = await EmployeeType.findOne({ employeeTypeName: req.body.employeeTypeName })

    if (existingEmployeeType) {
        res.json({
            success: false,
            message: "Employee Type Name already in use"
        })
        return
    }
    const employeeType = new EmployeeType({
        employeeTypeName: req.body.employeeTypeName
    })

    await employeeType.save()
    res.json({
        success: true,
        message: "Employee Type Name is Registered!"
    })
})

//get one userType Details
router.get('/:_id', async (req, res) => {
    const aEmployeeTypeDetails = await EmployeeType.findById(req.params._id)
    res.json({
        employeeTypeDetails: aEmployeeTypeDetails
    })
})

//get all userType Details
router.get('/', async (req, res) => {
    const employeeTypeDetails = await EmployeeType.find({})
    res.status(200).json({
        details: employeeTypeDetails
    })
})

//Update userType details
router.patch('/:_id', async (req, res) => {
    const thisEmployeeType = await EmployeeType.findOne({ userTypeId: req.body.employeeTypeName })
    const existingEmployeeType = await EmployeeType.findOne({ _id: req.params._id, employeeTypeName: req.body.employeeTypeName })
    const isAdmin = await EmployeeType.findById( req.params._id )

    if (isAdmin.employeeTypeName === 'Administrator') {
        res.json({
            success: false,
            message: "Can not Edit"
        })
        return
    }

    if (!existingEmployeeType && thisEmployeeType) {
        res.json({
            success: false,
            message: "Employee Type Name already in use. Please enter another one"
        })
        return
    }

    await EmployeeType.findByIdAndUpdate(req.params._id, { $set: { employeeTypeName: req.body.employeeTypeName } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })

})

//Delete user type
router.delete('/:_id', async (req, res) => {
    const isAnyEmployee = await Employee.findOne({ employeeTypeId: req.params._id })
    const isAdmin = await EmployeeType.findById( req.params._id )
    if (isAnyEmployee || isAdmin.employeeTypeName === 'Administrator') {
        res.json({
            success: false,
            message: "Can not Delete"
        })
        return
    } else {
        await EmployeeType.findByIdAndDelete(req.params._id)
            .then(() => {
                res.json({
                    success: true
                })
            })
    }
})

module.exports = router;