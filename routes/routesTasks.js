const express = require('express')
const router1 = express.Router()
const projects = require('../controllers/projects')
const tasks = require('../controllers/tasks')



router1.get('/',tasks.getAllTasks)

router1.get('/projectid/:id',tasks.getTaskByProjectId)

router1.get('/iscompleted',tasks.getTaskByIsCompleted)

router1.get('/duedate',tasks.getTaskByDueDate)

router1.get('/createdat',tasks.getTaskByCreatedAt)


router.post('/:id/comments',createTaskComments)
router.put('/:id/comments',updateTaskComments)
router.delete('/:id/comments',deleteTaskComments)
module.exports = router1