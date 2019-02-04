const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const attendRoutes = require('./api/routes/attends');
const departmentRoutes = require('./api/routes/departments');
const employeeRoutes = require('./api/routes/employees');
const employeeTypeRoutes = require('./api/routes/employeeTypes');
const faultCategoryRoutes = require('./api/routes/faultcategories');
const faultRoutes = require('./api/routes/faults');
const jobRoutes = require('./api/routes/jobs');
const machineRoutes = require('./api/routes/machines');
const roleRoutes = require('./api/routes/roles');
const employeeRoleRoutes = require('./api/routes/relation_routes/employeeRoles');
const assignTechnicianRoutes = require('./api/routes/relation_routes/assignTechnicians');
const jobFaultRoutes = require('./api/routes/relation_routes/jobFaults');
const solveRoutes = require('./api/routes/relation_routes/solves');

app.use(morgan("dev"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/jcsdatabase', { useNewUrlParser: true })
    .then(() => console.log('MogoDB Connected...'))
    .catch(err => console.log(err))



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/api/attends', attendRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employeeTypes', employeeTypeRoutes);
app.use('/api/faultCategories', faultCategoryRoutes);
app.use('/api/faults', faultRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/employeeRoles', employeeRoleRoutes);
app.use('/api/assignTechnicians', assignTechnicianRoutes);
app.use('/api/jobFaults', jobFaultRoutes);
app.use('/api/solves', solveRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;