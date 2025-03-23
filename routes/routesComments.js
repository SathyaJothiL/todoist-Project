import express from "express";
import * as comments from "../controllers/comments.js";
const routerComments = express.Router();

routerComments.get("/:id", comments.getComment);

routerComments.post("/", comments.createComment);

routerComments.put("/:id", comments.updateComment);

routerComments.delete("/:id", comments.deleteComment);

export default routerComments;
