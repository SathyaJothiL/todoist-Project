import * as models from "../models/model.js";
import CustomError from "../middlewares/customError.js";

export const getComment = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  models
    .getComment(id)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const createComment = (req, res, next) => {
  let commentData = {
    content: req.body.content,
    task_id: req.body.taskId,
    project_id: req.body.projectId,
  };
  if (typeof commentData.content !== "string") {
    return next(new CustomError(400, "Send Correct Data Format"));
  }
  if (commentData.task_id === "null") {
    commentData.task_id = null;
    if (isNaN(commentData.project_id)) {
      return next(new CustomError(400, "Send valid Project Id"));
    }
  } else if (commentData.project_id === "null") {
    commentData.project_id = null;
    if (isNaN(commentData.task_id)) {
      return next(new CustomError(400, "Send valid Task Id"));
    }
  } else {
    return next(new CustomError(400, "Select Task or Comment Id"));
  }

  models
    .createComment(commentData)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};

export const updateComment = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }
  let commentData = {
    content: req.body.content,
  };
  if (typeof commentData.content !== "string") {
    return next(new CustomError(400, "Send Correct Data Format"));
  }

  models
    .updateComment(id, commentData)
    .then((data) => {
      if (!data[0].affectedRows === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

export const deleteComment = (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  models
    .deleteComment(id)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        return next(new CustomError(404, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};
