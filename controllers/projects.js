import _ from "lodash";
import * as models from "../models/model.js";
import CustomError from "../middlewares/customError.js";

export const getOne = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  models
    .getOne(id)
    .then((data) => {
      if (data.length === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const createOne = (req, res, next) => {
  if (validateProject(req.body).isEmpty === true) {
    return next(new CustomError(400, "Send all Data"));
  }
  if (validateProject(req.body).isInvalid === true) {
    return next(new CustomError(400, "Send Correct Data Format"));
  }

  let projectData = {
    name: req.body.name,
    color: req.body.color,
    is_favourite: req.body.isFavourite,
    user_id: req.body.userId,
  };
  models
    .createOne(projectData)
    .then((data) => res.status(201).json(data))
    .catch((err) => next(err));
};

export const getAll = (req, res, next) => {
  models
    .getAll(projectData)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const updateOne = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }
  if (validateProject(req.body).isEmpty === true) {
    return next(new CustomError(400, "Send all Data"));
  }
  if (validateProject(req.body).isInvalid === true) {
    return next(new CustomError(400, "Send Correct Data Format"));
  }
  let projectData = {
    name: req.body.name,
    color: req.body.color,
    is_favourite: req.body.isFavourite,
  };

  models
    .updateOne(id, projectData)
    .then((data) => {
      if (!data[0].affectedRows === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

export const deleteOne = (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  models
    .deleteOne(id)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        return next(new CustomError(404, "Id does not exists"));
      }
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const deleteAll = (req, res, next) => {
  models
    .deleteAll(projectData)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

export const updateIsFavourite = (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return next(new CustomError(400, "Id parameter is Invalid"));
  }

  if (req.body.isFavourite !== "0" && req.body.isFavourite !== "1") {
    return next(new CustomError(400, "Invalid is_favourite input"));
  }
  const isFavouriteData = {
    is_favourite: req.body.is_favourite === "1" ? 1 : 0,
  };

  models
    .updateIsFavourite(id, isFavouriteData)
    .then((data) => {
      if (data[0].affectedRows === 0) {
        return next(new CustomError(500, "Id does not exists"));
      }
      res.status(201).json(data);
    })
    .catch((err) => next(err));
};

function validateProject(requestData) {
  console.log(requestData);

  let result = {
    isInvalid: null,
    isEmpty: null,
  };
  if (_.isEmpty(requestData)) {
    result.isEmpty = true;
    return result;
  }
  let keyList = ["name", "color", "isFavourite", "userId"];

  for (let i of keyList) {
    if (
      requestData[i] === "" ||
      requestData[i] === null ||
      requestData[i] === undefined
    ) {
      console.log(i);
      result.isEmpty = true;
      return result;
    }
  }
  if (typeof requestData.name !== "string") {
    result.isInvalid = true;
    return result;
  }
  if (typeof requestData.color !== "string") {
    if (!requestData.match(/^[a-zA-Z]+$/)) {
      result.isInvalid = true;
      return result;
    }
    result.isInvalid = true;
    return result;
  }
  if (requestData.isFavourite !== "0" && requestData.isFavourite !== "1") {
    result.isInvalid = true;
    return result;
  }
  if (isNaN(requestData.userId)) {
    result.isInvalid = true;
    return result;
  }
  return result;
}

// let projectData = {
//     name: 'Updated project with id 11',
//     color: 'yellow',
//     is_favourite: 0,
//     user_id: 1
//   }
//   const isFavouriteData = {
//     is_favourite: '0'
//   }
