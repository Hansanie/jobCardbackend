const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/relationships/EmployeeRole');
const EmployeeRole = mongoose.model('employeeRoles');

//set employee role
router.post('/:employeeTypeId', async (req, res) => {
    for (let i = 0; i < req.body.roleId.length; i++) {
        const existingEmployeeTypeRole = await EmployeeRole.findOne({ employeeTypeId: req.params.employeeTypeId, roleId: req.body.roleId[i] })

        if (!existingEmployeeTypeRole) {
            const employeeRole = new EmployeeRole({
                employeeTypeId: req.params.employeeTypeId,
                roleId: req.body.roleId[i]
            })
            await employeeRole.save()
        }
    }
    res.json({
        success: true,
        message: "Your data is Updated!"
    })
})

//get employee role Details
router.get('/:employeeTypeId', async (req, res) => {
    const setRolesForAType = await EmployeeRole.find({employeeTypeId:req.params.employeeTypeId}).populate('roleId')
    res.json({
        setRolesForAType: setRolesForAType
    })
})

//Update employee role details
router.patch('/:_id', async (req, res) => {
    const existingFaultCategory = await EmployeeRole.findOne({ employeeTypeId: req.params.employeeTypeId, roleId: req.body.roleId })

    if (!existingFaultCategory) {
        await EmployeeRole.findOne(req.params._id, { $set: { faultCategoryName: req.body.faultCategoryDescription, faultCategoryName: req.body.faultCategoryDescription } })
    }

    await FaultCategory.findByIdAndUpdate(req.params._id, { $set: { faultCategoryName: req.body.faultCategoryDescription, faultCategoryName: req.body.faultCategoryDescription } })
        .then(() => {
            res.json({
                success: true,
                message: "Your data is Updated!"
            })
        })

})

module.exports = router;