const models = require('../models/model')
const _ = require('lodash')

exports.createTask = (req,res,next)=>{
    let id = parseInt(req.params.id)
    if(!validateTask(req.body)){
        const error = new Error("Please provide correct or all details of task")
        error.status = 400
        next(error)
        return
    }
    if(!validateId(id)){
        const error = new Error("Please provide valid ID")
        error.status = 400
        next(error)
        return
    }
    let taskData = {
        content: req.body.content,
        description: req.body.description,
        due_date: req.body.due_date,
        is_completed: req.body.is_completed,
        created_at: req.body.created_at,
        project_id: id
    }
    models.createTaskProject(taskData,(err,result)=>{
        if(err){
            return next(err)
        }
        console.log(result);
        
        res.status(201).json({message:result})
    })
    
}

exports.editTask = (req,res,next)=>{
    let id1 = parseInt(req.params.id1)
    let id2 = parseInt(req.params.id2)
    if(!validateId(id1)){
        const error = new Error("Please provide valid task Id")
        error.status = 400
        next(error)
        return
    }
    if(!validateId(id2)){
        const error = new Error("Please provide valid task Id")
        error.status = 400
        next(error)
        return
    }
    if(!validateTask(req.body)){
        const error = new Error("Please provide correct or all details of task")
        error.status = 400
        next(error)
        return
    }
    let taskData = {
        content: req.body.content,
        description: req.body.description,
        due_date: req.body.due_date,
        is_completed: req.body.is_completed,
        created_at: req.body.created_at,
        project_id: id1,
        task_id : id2
    }
    models.editTaskProject(taskData,(err,result)=>{
        if(err){
            if(err.kind){
                const error = new Error(`Task with id ${taskData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            return next(err)
        }
        res.status(201).json({message: result.message})
    })
}


exports.deleteTask = (req,res,next)=>{
    let id1 = parseInt(req.params.id1)
    let id2 = parseInt(req.params.id2)
    if(!validateId(id1)){
        const error = new Error("Please provide valid task Id")
        error.status = 400
        next(error)
        return
    }
    if(!validateId(id2)){
        const error = new Error("Please provide valid task Id")
        error.status = 400
        next(error)
        return
    }
    idData = {
        projectId : id1,
        taskId : id2
    }
    models.deleteTaskProject(idData,(err,result)=>{
        if(err){
            if(err.kind ==='notFound'){
                const error = new Error(`Task with id ${idData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            next(err)
            return
        }
        res.status(200).json({message:result.message})
    })
}


exports.getAllTasks = (req,res,next)=>{
    models.getAllTasksProject((err,result)=>{
        if(err){
            return next(err)
        }
        res.status(200).json(result.message)
    })
}

exports.getTaskByProjectId = (req,res,next)=>{

    let id = parseInt(req.params.id)
    console.log(id);
    

    models.taskByProjectId(id,(err,result)=>{
        if(err){
            if(err.kind){
                const error = new Error(`Task with id ${taskData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            return next(err)
        }
        res.status(200).json(result)
    })
}

exports.getTaskByIsCompleted = (req,res,next)=>{
    let is_completed = parseInt(req.body.is_completed)
    
    if(is_completed !== 0 && is_completed!==1){
        const error = new Error("Please give 0 or 1")
        error.status = 400
        next(error)
    }
    models.taskByIsCompleted(is_completed,(err,result)=>{
        if(err){
            if(err.kind){
                const error = new Error(`Task with id ${taskData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            return next(err)
        }
        res.status(200).json(result)
    })
}

exports.getTaskByDueDate = (req,res,next)=>{
    let regex = /^(202[5-9])-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/

    let due_date =req.body.due_date
    if(due_date.match(regex)){
        const err = new Error("Please give date in YYYY-MM-DD format")
        err.status = 400
        next(err)
    }
    due_date = new Date(due_date)
    models.taskByDueDate(due_date,(err,result)=>{
        if(err){
            if(err.kind){
                const error = new Error(`Task with id ${taskData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            return next(err)
        }
        res.status(200).json(result)
    })
}

exports.getTaskByCreatedAt = (req,res,next)=>{
    let regex = /^202[5-9]-(0[1-9]|1[0-2])-(0[1-9]|1[0-9])|2[0-9]|3[0-1]/
    let created_at = req.body.value
    if(created_at.match(regex)){
        const err = new Error("Please give date in YYYY-MM-DD format")
        err.status = 400
        next(err)
    }

    models.taskByCreatedAt(created_at,(err,result)=>{
        if(err){
            if(err.kind){
                const error = new Error(`Task with id ${taskData.id2} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            return next(err)
        }
        res.status(200).json(result)
    })
}








// let a = {a:4}
// let b = {c:'sfddf',d:'sdff'}
// let o = {...a, ...b}
// console.log(o);


function validateTask(requestData){
    console.log(requestData);
    if(requestData===null || requestData===undefined || _.isEmpty(requestData)){
        return false
    }
    return true
}

function validateId(id){
    if(isNaN(id)){
        return false
    }
    return true
}