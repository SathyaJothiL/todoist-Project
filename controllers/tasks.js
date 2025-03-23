import * as models from "../models/model.js";
import CustomError from "../middlewares/customError.js";
import _ from "lodash";

export const getAllTasks = (req, res, next) => {
  models
    .getAllTasks()
    .then((data) => {
      res.status(200).json({ message: "All tasks fecthed" });
    })
    .catch((err) => next(err));
};

export const getOneTask = (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }
  models
    .getOneTasks(id)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const createTask = (req, res, next) => {
  if (validateTask(req.body).isEmpty === true) {
    return next(new CustomError(400, "Send all Data"));
  }
  if (validateTask(req.body).isInvalid === true) {
    return next(new CustomError(400, "Send Correct Data Format"));
  }
  if (!validateId(req.body.projectId)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  let taskData = {
    content: req.body.content,
    description: req.body.description,
    due_date: req.body.dueDate,
    is_completed: req.body.isCompleted,
    project_id: req.body.projectId,
  };
  models
    .createTask(taskData)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};

export const editTask = (req, res, next) => {
  let id = parseInt(req.params.id);

  if (!validateId(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }
  if (validateTask(req.body).isEmpty === true) {
    return next(new CustomError(400, "Send all Data"));
  }
  if (validateTask(req.body).isInvalid === true) {
    return next(new CustomError(400, "Send Correct Data Format"));
  }
  let taskData = {
    content: req.body.content,
    description: req.body.description,
    dueDate: req.body.dueDate,
    isCompleted: req.body.isCompleted,
  };
  models
    .editTask(id, taskData)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};

export const deleteTask = (req, res, next) => {
  let id = parseInt(req.params.id);

  if (!validateId(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  models
    .deleteTask(id)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        return next(new CustomError(404, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const getTaskByProjectId = (req, res, next) => {
  let projectId = parseInt(req.params.id);

  if (!validateId(projectId)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }
  models
    .getTaskByProjectId(projectId)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        return next(new CustomError(404, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const getTaskByIsCompleted = (req, res, next) => {
  let isCompleted = parseInt(req.query.isCompleted);
  let userId = parseInt(req.query.userId);
  console.log(isCompleted);
  if (isCompleted !== 0 && isCompleted !== 1) {
    return next(new CustomError(404, "Please give 0 or 1"));
  }

  models
    .getTaskByIsCompleted(userId, isCompleted)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(404, "Empty data"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const getTaskByDueDate = (req, res, next) => {
  let regex = /^(202[5-9])-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

  let dueDate = req.query.dueDate;
  let userId = parseInt(req.query.userId);

  if (!dueDate.match(regex)) {
    return next(new CustomError(404, "Please give date in YYYY-MM-DD format"));
  }
  models
    .getTaskByDueDate(userId, dueDate)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(404, "Empty data"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const getTaskByCreatedAt = (req, res, next) => {
  let regex = /^202[5-9]-(0[1-9]|1[0-2])-(0[1-9]|1[0-9])|2[0-9]|3[0-1]/;

  let userId = parseInt(req.query.userId);
  let createdAt = req.query.createdAt;

  if (!createdAt.match(regex)) {
    return next(new CustomError(404, "Please give date in YYYY-MM-DD format"));
  }

  models
    .getTaskByCreatedAt(userId, createdAt)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(404, "Empty data"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

function validateTask(requestData) {
  console.log(requestData);
  let result = {
    isInvalid: null,
    isEmpty: null,
  };
  if (_.isEmpty(requestData)) {
    result.isEmpty = true;
    return result;
  }

  for (let i in requestData) {
    if (i === "" || i === null || i === undefined) {
      result.isEmpty = true;
      return result;
    }
  }
  if (
    typeof requestData.content !== "string" &&
    typeof requestData.description !== "string"
  ) {
    result.isInvalid = true;
    return result;
  }
  if (requestData.isCompleted !== "0" && requestData.isCompleted !== "1") {
    result.isInvalid = true;
    return result;
  }
  let regex = /^202[5-9]-(0[1-9]|1[0-2])-(0[1-9]|1[0-9])|2[0-9]|3[0-1]/;
  if (!requestData.dueDate.match(regex) && !requestData.dueDate.match(regex)) {
    result.isInvalid = true;
    return result;
  }
  return result;
}

function validateId(id) {
  if (isNaN(id)) {
    return false;
  }
  return true;
}
