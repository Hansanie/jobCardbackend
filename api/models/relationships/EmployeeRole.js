const mongoose = require('mongoose');

const EmployeeRoleSchema = new mongoose.Schema({
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true },
    employeeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employeeTypes', required: true }
});

mongoose.model('employeeRoles', EmployeeRoleSchema);