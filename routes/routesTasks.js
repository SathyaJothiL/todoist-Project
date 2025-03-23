import express from "express";
const routerTasks = express.Router();
import * as tasks from "../controllers/tasks.js";

routerTasks.get("/projectid/:id", tasks.getTaskByProjectId);

routerTasks.get("/iscompleted", tasks.getTaskByIsCompleted);

routerTasks.get("/duedate", tasks.getTaskByDueDate);

routerTasks.get("/createdat", tasks.getTaskByCreatedAt);

routerTasks.get("/", tasks.getAllTasks);

routerTasks.get("/:id", tasks.getOneTask);

routerTasks.post("/", tasks.createTask);

routerTasks.put("/:id", tasks.editTask);

routerTasks.delete("/:id", tasks.deleteTask);

export default routerTasks;
