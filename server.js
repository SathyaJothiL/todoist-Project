import express from "express";
import bodyParser from "body-parser";
import router from "./routes/routes.js";
import routerTasks from "./routes/routesTasks.js";
import routerComments from "./routes/routesComments.js";
import * as errors from "./middlewares/errorhandling.js";
const PORT = 3010;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/projects", router);

app.use("/tasks", routerTasks);

app.use("/comments", routerComments);

app.use(errors.catchUnhandledUrl);

app.use(errors.errorHandler);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error listening to port", PORT);
    return;
  }
  console.log("Listening on port", PORT);
});
