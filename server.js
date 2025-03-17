const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const port = 3010
const app = express()
const _ = require('lodash')
const connection = require('./models/connectDatabase')
const router = require('./routes/routes')
const routerTasks = require('./routes/routesTasks')

app.use(bodyParser.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    console.log("route");
    res.status(200).json({message:"Welcome to home page"})
})


app.use('/projects',router)

app.use('/tasks',routerTasks)












app.use((req,res,next)=>{
    const error = new Error("Url doesn't exists")
    error.status = 404
    next(error)
})

app.use((err,req,res,next)=>{
    if(err.status){
        console.log(err.message);
        res.status(err.status).json({message:err.message || "Error"})
        return
    }
    err.status = 500
    res.status(err.status).json({message:"Internal Server Error"})
    console.log(err.message)
    console.log("Error in Server");
})











app.listen(port,(err)=>{
    if(err){
        console.log("Error listening to port",port);
        return
    }
    console.log("Listening on port",port);
})