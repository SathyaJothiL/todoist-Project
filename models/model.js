const { callbackify } = require("util");
const connection = require("./connectDatabase");
const { result } = require("lodash");

exports.createProject = (projectData, callback) => {
  let query = "INSERT INTO PROJECTS(NAME_,COLOR,IS_FAVOURITE) VALUES(?,?,?)";
  connection.query(
    query,
    [projectData.name, projectData.color, projectData.is_favourite],
    (err, result) => {
      if (err) {
        console.log(err.message);
        console.log("Couln't insert into the Database");
        callback(err, null);
        return;
      }
      if (result.affectedRows === 0) {
        console.log("Zero rows affected");
        callback({ kind: "notFound" }, null);
        return;
      }
      console.log("Inserted into the database");
      callback(null, projectData);
    }
  );
};

exports.getAllProject = (callback) => {
  let query = `SELECT * FROM PROJECTS`;
  connection.query(query, [], (err, rows, fileds) => {
    if (err) {
      console.log("Error retrieving all Projects from Database");
      console.log(err.message);
      callback(err, null);
      return;
    }
    console.log("Data retrieved from Project database");
    callback(null, rows);
  });
};

exports.getOneProject = (id, callback) => {
  let query = `SELECT * FROM PROJECTS WHERE ID = ${id}`;
  connection.query(query, [], (err, rows) => {
    if (err) {
      console.log(err.message);
      console.log(`"Error getting the data with id ${id}"`);
      callback(err, null);
      return;
    }
    if (rows.length === 0) {
      console.log("No rows affected");
      callback({ kind: "notFound" }, null);
      return;
    }
    console.log(`"Project with Id ${id} retrieved successfully"`);
    callback(null, rows);
  });
};

exports.updateOneProject = (id,projectData, callback) => {
  let sql = `UPDATE PROJECTS
    SET NAME_=?,
        COLOR = ?,
        IS_FAVOURITE=?
    WHERE ID = ?`;

  connection.query(
    sql,
    [projectData.name, projectData.color, projectData.is_favourite, id],
    (err, rows) => {
      if (err) {
        console.log(`"Error updating Projects for id ${id}"`);
        callback(err,null)
        return
      }
      if (rows.affectedRows === 0) {
        console.log("No rows affected");
        callback({kind:'notFound'},null)
        return
      }
      console.log(`"Updated ${id} successfully in Database"`);
      callback(null,rows)
    }
  );
};

exports.deleteOneProject = (id,callback)=>{
    let sql = `DELETE FROM PROJECTS WHERE ID = ?`
    connection.query(sql,[id],(err,result)=>{
        if(err){
            console.log(err.message);
            console.log("Error deleting the project with ID",id);
            callback(err,null)
            return
        }
        if(result.affectedRows===0){
            console.log("No rows affected");
            callback({kind:'notFound'},null)
            return
        }
        console.log(`"Project with ID ${id} deleted successfully"`);
        callback(null,{message:`Project with ID ${id} deleted successfully` })
    })
}

exports.deleteAllProject = (callback)=>{
    let sql = `DELETE FROM PROJECTS`
    connection.query(sql,[],(err,result)=>{
        if(err){
            console.log(err.message);
            console.log("Error deleting the project");
            callback(err,null)
            return
        }
        console.log(`"All Project successfully"`);
        callback(null,{message:`All Project deleted successfully` })
    })
}

exports.createTaskProject = (taskData,callback)=>{
    let sql = `INSERT INTO TASKS
                (CONTENT,DESCRIPTION,DUE_DATE,PROJECT_ID)
                VALUES(?,?,?,?) `
    connection.query(sql,[taskData.content,taskData.description,taskData.due_date,taskData.id],(err,rows)=>{
        if(err){
            console.log("Couldn't insert task into database");
            console.log(err.message);
            callback(err,null)
            return
        }
        // if(rows.affectedRows===0){
        //     console.log("");
            
        //     callback({kind:'notFound'},nul)
        // }
        console.log(rows);
        console.log(`Inserted Task with id ${rows.insertId} into database successfully`);
        callback(null,{id: rows.insertId, ...taskData})
    })
}

exports.editTaskProject = (taskData,callback)=>{
    let sql = `UPDATE TASKS
                SET CONTENT = ?,
                    DESCRIPTION = ?,
                    DUE_DATE = ?,
                    IS_COMPLETED=?
                    WHERE ID = ?
                    AND 
                    PROJECT_ID = ?`
    connection.query(sql,[taskData.content,taskData.description,taskData.due_date,taskData.is_completed,taskData.task_id,taskData.project_id],(err,rows)=>{
        console.log(rows);
        if(err){
            console.log("Error updating to database");
            console.log(err.message);
            return callback(err,null)
        }
        if(rows.affectedRows===0){
            console.log("No rows affected");
            return callback({kind:'notFound'},null)
        }
        console.log(`"Updated task with id ${rows.insertId} database successfully"`);
        callback(null,{message:`Updated task with id ${rows.insertId} database successfully`})
    })
}




exports.deleteTaskProject = (idData,callback)=>{
    let sql = `DELETE FROM TASKS WHERE ID = ? AND PROJECT_ID = ?`
    connection.query(sql,[idData.taskId,idData.project_id],(err,rows)=>{
        if(err){
            console.log(`"Error deleting the task with id ${taskId}"`);
            console.log(err.message)  
            return callback(err,null)
        }
        if(rows.affectedRows===0){
            console.log("No rows affected");
            return callback({kind:'notFound'},null)
        }
        console.log(`"Deleted task with id ${rows.insertId}"`);
        callback(null,{message:`Deleted task with id ${rows.insertId}`})
    })
}

exports.updateIsFavouriteProject = (data,callback)=>{
    let sql = `UPDATE PROJECTS
                SET IS_FAVOURITE = ?
                 WHERE ID = ? `
    connection.query(sql,[data.is_favourite,data.id],(err,result)=>{
      if(err){
        console.log("Error updating is_favourite column in database");
        console.log(err.message);
        return callback(err,null)
      }
      if(result.affectedRows===0){
        console.log("No rows affected");
        return callback({kind:'notFound'},null)
      }
      console.log(`"Successfully updated isfavourite column with id ${data.id}"`);
      callback(null,{message:`Successfully updated isfavourite column with id ${data.id}`})
    })
}

exports.getAllTasksProject = (callback)=>{
  let sql = `SELECT * FROM TASKS`
  connection.query(sql,[],(err,result)=>{
    if(err){
      return callback(err,null)
    }
    console.log("Task data retrieved from Database successfully");
    callback(null,result)
  })
}

exports.taskByProjectId = (id,callback)=>{
  let sql = `SELECT * FROM TASKS WHERE PROJECT_ID = ?`

  connection.query(sql,[id],(err,result)=>{
    if(err){
      return callback(err,null)
    }
    if(result.affectedRows===0){
      return callback({kind:'notFound'},null)
    }
    console.log(`"Tasks with project id ${id} retrieved successfully"`);
    callback(null,{id, ...result})
  })
}

exports.taskByIsCompleted = (is_completed, callback)=>{
  let sql = `SELECT * FROM TASKS WHERE IS_COMPLETED = ?`

  connection.query(sql,[is_completed],(err,result)=>{
    if(err){
      return callback(err,null)
    }
    if(result.affectedRows===0){
      return callback({kind:'notFound'},null)
    }
    console.log("Task data retrieved from Database successfully");
    callback(null,result)

  })
}

exports.taskByDueDate = (due_date,callback)=>{
  let sql = `SELECT * FROM TASKS WHERE DUE_DATE = ?`
  connection.query(sql,[due_date],(err,result)=>{
    if(err){
      return callback(err,null)
    }
    if(result.affectedRows===0){
      return callback({kind:'notFound'},null)
    }
    console.log("Task data retrieved from Database successfully");
    callback(null,result)
  })
}