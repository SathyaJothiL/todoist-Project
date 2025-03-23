import express from 'express'
import * as projects from '../controllers/projects.js'
const router = express.Router()


router.post('/',projects.createOne)

router.get('/',projects.getAll)

router.get('/:id',projects.getOne)

router.put('/:id',projects.updateOne)

router.delete('/:id',projects.deleteOne)

router.delete('/',projects.deleteAll)

router.patch('/favourite/:id',projects.updateIsFavourite)

// router.get('/:id/comments',getProjectComments)
// router.post('/:id/comments',createProjectComments)
// router.put('/:id/comments',updateProjectComments)
// router.delete('/:id/comments',deleteProjectComments)
// module.exports = router

export default router