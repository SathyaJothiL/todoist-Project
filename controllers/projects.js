const models = require("../models/model")
const _ = require('lodash')



exports.create = (req,res,next)=>{
    if(!validateProject(req.body)){
        res.status(400).send("Send all Data")
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
            next(err)
        }else{
            res.send(result)
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
    if(!validateProject(req.body)){
        console.log("Data not validated");
        const error = new Error("Please give correct and all details")
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
    if( requestData===null || requestData===undefined || _.isEmpty(requestData)){
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