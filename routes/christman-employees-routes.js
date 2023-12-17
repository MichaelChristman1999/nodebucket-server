/*
 * Title: Christman-employee-routes.js
 * Author: Michael Christman
 * Date: October 28th, 2023
 * Sources:
 * Nodebucket Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/nodebucket
 * Previous repositories from my personal GitHub: https://github.com/MichaelChristman1999?tab=repositories
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference (for math.max map syntax reference)
 */

// Require statement for Express
const express = require("express");

// Require statement for Router
const router = express.Router();

// Require statement for Employee
const Employee = require("../models/Christman-employees");

/**
 * createEmployee
 * @openapi
 * /api/employees:
 *   post:
 *     tags:
 *       - Employees
 *     name: createEmployees
 *     summary: Creates a new customer for the Employees API
 *     requestBody:
 *       description: Information about the employee
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - employeeId
 *               - position
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Customer added to NodeShopper API
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/employees', async (req,res) => {
  //Grabs information from the req.body function to initialize variables.
  const { firstName, lastName, employeeId, position } = req.body; 
  console.log(req.body)

  try{
      //creates a new customer. Checks to see if all parameters are met
      const newEmployee = await Employee.create({ firstName, lastName, employeeId, position })
      if(!newEmployee){
          //if all parameters are not met, throws an error
          res.status(500).send( { 'message': `MongoDB Exception 501`})
      }
      else {
          //if successful, creates a new customer
          res.status(200).json(newEmployee);
      }
  }
  catch (error) {
      //if the request is bad, throws an error
      res.status(501).json({ 'message': `Server Exception: ${error.message}` })
  }
})

/**
* findAllEmployees
* @openapi
* /api/employees:
*   get:
*     tags:
*       - Employees
*     description: Returns a list of all employees from the Employees API database
*     summary: Returns the data for all of the employees
*     operationid: findAllEmployees
*     responses:
*       '200':
*         description: "Successful retrieval of documents from the Employees API"
*       '500':
*         description: "Server exceptions"
*       '501':
*         description: "MongoDB exceptions"
*/
router.get('/employees', async (req,res) => {

  //Currently, model.find does not accept callback. I've placed the original code in comments to show that I understand the assignment
  //But placed code that does work for the time being.

  // try {
  //     await People.find({}, function(err, people) {
  //         if(err) {
  //             res.status(501).send({
  //                 'message': `MongoDB Exception: ${err}`
  //             })
  //         }else {
  //             res.json(people);
  //         }
  //     })
  // } catch(e) {
  //     console.log(e)
  //     res.status(500).send({
  //         'message': `Server Exception: ${e.message}`
  //     })
  // }

  // TODO: add a try and catch

  //Searches the database for all teams
  const employees = await Employee.find({ })

  //returns the teams that are found
  res.status(200).json(employees);
})

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{employeeId}:
 *   get:
 *     tags:
 *       - Employee
 *     description: API for returning an Employee document
 *     summary: Returns a Single Employee Document
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Employee Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "Successful retrieval of a document containing the employee"
 *       '400':
 *         description: "Bad Request"
 *       '404':
 *         description: "Not Found"
 *       '500':
 *         description: "Server exceptions"
 */

router.get("/employees/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Find an employee based on the 'employeeId' field from schema
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // If the employee is found, return the employee details
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Server Exception: ${err.message}` });
  }
});

/**
 * createTask
 * @openapi
 * /api/employees/{employeeId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     summary: Creates a new task and apply it to the appropriate employee
 *     parameters:
 *      - name: employeeId
 *        in: path
 *        required: true
 *        description: Id for employee
 *        schema: 
 *          type: string
 *     requestBody:
 *       description: Information about the task
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - taskDescription
 *               - date
 *               - importance
 *               - status
 *               - taskId
 *             properties:
 *               taskName:
 *                 type: string
 *               taskDescription:
 *                 type: string
 *               date:
 *                 type: string
 *               importance: 
 *                 type: string
 *               status:
 *                 type: string
 *               taskId:
 *                 type: string
 *     responses:
 *       '200':
 *         description:  New invoice created
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */


router.post('/employees/:employeeId/tasks', async (req, res) => {

  try{
      // searches for a user based on the parameters written by the user
      const employee = await Employee.findOne({ 'employeeId': req.params.employeeId })
      console.log(req.params.employeeId)
      console.log(employee)
      if(!employee){
          // if no user is found, throws an error
          res.status(501).send({ 'message': 'MongoDB Exception'})
      }
      else
      {
          //if a user is found, a new invoice object is created and initialized with the req.body values
          const newTask = {
              taskName: req.body.taskName,
              taskDescription: req.body.taskDescription,
              date: req.body.date,
              importance: req.body.importance, 
              status: req.body.status, 
              taskId: req.body.taskId
          }   
          console.log(newTask)
          // pushes the new object into an array already placed in the user's data
          employee.tasks.push(newTask)
          
          //saves the new data to the database
          employee.save()
          res.status(200).json(employee)
      }
  }
  catch (error) {
      //if unsuccessful, throws an error
      res.status(500).send({ 'message': `Server Exception: ${error.message} `})
  }
})

/**
 * findAllTasks
 * @openapi
 * /api/employees/{employeeId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     description: Returns a list of tasks that the employee has
 *     summary: Returns a list of tasks
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Employee ID that the employee has. 
 *         schema: 
 *           type: string
 *     operationid: findAllTasks
 *     responses:
 *       '200':
 *         description: "Successful retrieval of documents from the Employee API"
 *       '500':
 *         description: "Server exceptions"
 *       '501':
 *         description: "MongoDB exceptions"
 */

router.get('/employees/:employeeId/tasks', async (req,res) => {
  try {
      //searches for a user in the database
      const employee = await Employee.findOne({ 'employeeId': req.params.employeeId })
      if(!employee){
          //if no user is found, throws an error
          res.status(501).send({ 'message': 'Mongo Exception Error'})
      }
      else
      {
          //if successful, sets status to 200 and returns the customer.
          res.status(200).json(employee); 
      }
  }
  catch(e) {
      //if unsuccessful, throws an error
      res.status(500).send({ 'message': `Server Exception: ${e.message}`})
  }
})

/************************************************************************************** */

//  API for deleting a task for an employee in MongoDB.
/**
 * deleteTask
 * @openapi
 * /api/employees/{employeeId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     name: deleteTask
 *     description:  API for deleting a task for an employee in MongoDB.
 *     summary: Deletes a task by employeeId.
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Enter a valid Employee ID between 1007-1012
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: Enter the ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: No Content
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.delete('/employees/:employeeId/tasks/:taskId', async (req, res) => {
  try {

      await Employee.findOneAndUpdate(
          { employeeId: req.params.employeeId }, 
          { $pull: { tasks: { taskId: req.params.taskId }}}, 
          { safe: true, multi: false}
      )
      return res.status(200).json({ message: 'Task deleted successfully '})
  }
  catch (e) {
      //if anything goes wrong, throws an error
      res.status(500).json({ error: `Server Exception ${e.message}` })
  }
})

/**
 * updateTasks
 * @openapi
 * /api/employees/{employeeId}/tasks/{taskId}:
 *   put:
 *     tags:
 *       - Employee
 *     name: updateTasks
 *     description: Updates an existing employee's tasks document
 *     summary: Updates the information of tasks of an employee
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Id of the employee to update. 
 *         schema: 
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: Id of the task to update. 
 *         schema: 
 *           type: string
 *     requestBody:
 *       description: Employee information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - taskName
 *               - taskDescription
 *               - date
 *               - importance
 *               - status
 *             properties:
 *               taskName:
 *                 type: string
 *               taskDescription:
 *                 type: string
 *               date:
 *                 type: string
 *               importance:
 *                 type: string
 *               status: 
 *                 type: string
 *     responses:
 *       '200':
 *         description: Employee updated
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.put('/employees/:employeeId/tasks/:taskId', async (req, res) => {
  const tasks = req.body

  try{
      await Employee.updateOne(
          { employeeId: req.params.employeeId, tasks: {$elemMatch: {taskId: req.params.taskId }} }, 
          { $set:  { 
              'tasks.$.taskName' : tasks.taskName,  
              'tasks.$.taskDescription': tasks.taskDescription, 
              'tasks.$.date': tasks.date, 
              'tasks.$.importance': tasks.importance, 
              'tasks.$.status': tasks.status,
              'tasks.$.taskId': req.params.taskId 
          } }
      )

      return res.status(200).json({ message: "Task updated successfully"})
      
      
      
      // const employee = Employee.findOne({ employeeId: req.params.employeeId })
      // if(!employee) {
      //     return res.status(501).send(response)
      // } 
      // employee.set({ 
      //     tasks
      // })
      
  }
  catch (error) {
      //throws an error if something goes wrong
      res.status(500).json({ error: error.message })
  }
})

// Export the router module for use in other parts of the application.
module.exports = router;