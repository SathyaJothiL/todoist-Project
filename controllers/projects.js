const models = require("../models/model")
const _ = require('lodash')



exports.create = (req,res,next)=>{
    if(validateProject(req.body).isEmpty===true){
        const error = new Error("Send all Data")
        error.status = 400
        next(error)
        return
    }
    if(validateProject(req.body).isInvalid===true){
        const error = new Error("Send Correct Data Format")
        error.status = 400
        next(error)
        return
    
    }
    let projectData = {
        name : req.body.name,
        color: req.body.color,
        is_favourite: req.body.is_favourite
    }
    models.createProject(projectData,(err,result)=>{
        if(err){
            if(err.kind==='notFound'){
                const err = new Error("Error in database query")
                err.status = 404
                next(err)
                return
            }
            next(err)
            return
        }
        
        res.status(201).json(result)
    })
}

exports.getAll = (req,res,next)=>{
    models.getAllProject((err,result)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json(result)
        }
    })

}

exports.getOne =(req,res,next)=>{
    const id = parseInt(req.params.id)
    models.getOneProject(id, (err,result)=>{
        if(err){
            if(err.kind==='notFound'){
                const error = new Error("No user with Id exists")
                error.status = 404
                next(error)
                return
            }
            next(err)
            return
        }
        res.send(result[0])
    })
}

exports.updateOne = (req,res,next)=>{
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        const error = new Error("Invalid ID")
        error.status = 400
        next(error)
        return
    }
    if(validateProject(req.body).isEmpty===true){
        const error = new Error("Send all Data")
        error.status = 400
        next(error)
        return
    }
    if(validateProject(req.body).isInvalid===true){
        const error = new Error("Send Correct Data Format")
        error.status = 400
        next(error)
        return
    
    }
    let projectData = {
        name : req.body.name,
        color: req.body.color,
        is_favourite: req.body.is_favourite
    }

    models.updateOneProject(id,projectData,(err,result)=>{
        if(err){
            if(err.kind==='notFound'){
                const error = new Error(`Project with ${id} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            next(err)
            return
        }
        res.status(201).send(result)
    })
}

exports.deleteOne = (req,res,next)=>{
    let id = parseInt(req.params.id)
    if(isNaN(id)){
        const error = new Error("Invalid ID")
        error.status = 400
        next(error)
        return
    }
    models.deleteOneProject(id,(err,result)=>{
        if(err){
            if(err.kind === 'notFound'){
                const error = new Error(`Project with ${id} doesn't exists`);
                error.status = 404;
                next(error);
                return
            }
            next(err)
            return
        }
        res.status(200).json({message:result.message})
        return
    })
}

exports.deleteAll = (req,res,next)=>{
    models.deleteAllProject((err,result)=>{
        if(err){
            next(err)
            return
        }
        res.status(200).json({message:result.message})
        return
    })
}


exports.updateIsFavourite = (req,res,next)=>{
    let id = parseInt(req.params.id)
    if(isNaN(id)){
        const error = new Error("Invalid ID")
        error.status = 400
        next(error)
        return
    }
    console.log(req.body.is_favourite);
    
    if(req.body.is_favourite!== '0' && req.body.is_favourite!== '1'){
        const error = new Error("Invalid is_favourite input")
        error.status = 400
        return next(error)
    }

    console.log(req.body);
    
    const data = {
        id : id,
        is_favourite: req.body.is_favourite === '1' ? 1 : 0
    }
    models.updateIsFavouriteProject(data,(err,result)=>{
        if(err){
            if(err.kind){
                const err= new Error (`Project with ${id} doesn't exists`)
                err.status = 404
                return next(err)
            }
           return next(err)
        }
        res.status(201).json({message:result.message})
    })
}



function validateProject(requestData){
    console.log(requestData);
    let result = {
        isInvalid:null,
        isEmpty : null,
    }
    if(_.isEmpty(requestData)){
        result.isEmpty = true
        return result
    }
    
    for(let i in requestData){
        if(i==='' || i===null || i ===undefined){
            result.isEmpty = true
            return result
        }
    }
    if(typeof(requestData.name)!=='string'){
        result.isInvalid = true
        return result
    }
    if(typeof(requestData.color)!=='string'){
        result.isInvalid = true
        return result
    }
    if(requestData.is_favourite!=='0' && requestData.is_favourite!=='1'){
        result.isInvalid = true
        return result
    }
    return result
}

// function validateId(id){
//     if(isNaN(id)){
//         return false
//     }
//     return true
// }