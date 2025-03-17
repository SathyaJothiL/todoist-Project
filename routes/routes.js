
const express = require('express')
const router = express.Router()
const projects = require('../controllers/projects')
const tasks = require('../controllers/tasks')

router.post('/',projects.create)

router.get('/',projects.getAll)

router.get('/:id',projects.getOne)

router.put('/:id',projects.updateOne)

router.delete('/:id',projects.deleteOne)

router.delete('/',projects.deleteAll)

router.post('/:id/tasks/',tasks.createTask)

router.put('/:id1/tasks/:id2',tasks.editTask)

router.delete('/:id1/tasks/:id2',tasks.deleteTask)

router.patch('/:id/favourite',projects.updateIsFavourite)

router.get('/:id/comments',getProjectComments)
router.post('/:id/comments',createProjectComments)
router.put('/:id/comments',updateProjectComments)
router.delete('/:id/comments',deleteProjectComments)
module.exports = router