/*
 * Title: Christman-employees.js
 * Author: Michael  Christman
 * Date: October 26th 2023
 * Sources:
 * Nodebucket Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/nodebucket
 * Previous repositories from my personal GitHub: https://github.com/MichaelChristman1999?tab=repositories
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

const mongoose = require('mongoose');

// Create a Schema object from Mongoose to define the structure of our data.
const Schema = mongoose.Schema;

const tasksSchema = new mongoose.Schema({
    "taskName": {
        type: String
    },
    "taskDescription": {
        type: String
    },
    "date": {
        type: String
    },
    "importance": {
        type: String
    }, 
    "status": {
        type: String
    }, 
    "taskId": {
        type: String 
    }
})

//initializes the cemployee Schema
const employeesSchema = new mongoose.Schema({
    "firstName":
    {
       type: String
    },
    "lastName":
    { 
       type: String
    },
    "employeeId":
    {
       type: String
    },
    "position":
    {
       type: String
    },
    "tasks": {
        type: [tasksSchema]
    }
});

//exports the schema
module.exports = mongoose.model('Employee', employeesSchema);