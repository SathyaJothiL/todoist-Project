const connection = require("./models/connectDatabase");

const createUsers = () => {
  let sql1 = `INSERT INTO USERS(NAME,EMAIL)
            VALUES ?`;

  let userArray = [],
    userEmail = "";
  for (let i = 1; i <= 50000; i++) {
    userEmail = `usertech${i}@gmail.com`;
    userName = `username_${i}`;
    userArray.push([userName, userEmail]);
  }
  connection.query(sql1, [userArray], (err, res) => {
    console.log(res);
    if (err) {
      console.log(err);

      console.log("possible not");
      return;
    }
    console.log("Posiible");
  });
};
createUsers()

const connection = require("./models/connectDatabase");
const createProjects = () => {
  let pickedColor, pickedfavourite, userId, is_favourite;
  let projectArray = [],
    name = "",
    color = [
      "blue",
      "red",
      "green",
      "yellow",
      "pink",
      "green",
      "lightpink",
      "purple",
      "lime",
      "cyan",
      "grey",
    ];
  for (let i = 1; i <= 50000; i++) {
    for (let j = 1; j <= 20; j++) {
      name = `Project${i}_${j}`;
      let random = Math.round(Math.random() * 10) || 1;
      pickedColor = color[random];
      pickedfavourite = random % 2;
      userId = i;
      projectArray.push([name, pickedColor, pickedfavourite, userId]);
    }
  }
  let sql2 = `INSERT INTO PROJECTS(NAME_,COLOR,IS_FAVOURITE,USER_ID) VALUES ?`;
  connection.query(sql2, [projectArray], (err, res) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log(res);
  });
};


createProjects()


const connection = require("./models/connectDatabase");
const createTasks = () => {
  const date = new Date();

  let taskArray = [],
    content,
    description,
    due_date,
    create_at,
    project_id;
  create_at = date.toISOString().split("T")[0];
  curr_month = date.getMonth();
  date.setMonth(curr_month + 1);
  due_date = date.toISOString().split("T")[0];
  let m = 100000;
  let j_count = 1;
  let taskLists = [];
  for (let i = 1; i <= 50000; i++) {
    for (let j = 1; j <= 20; j++) {
      for (let k = 1; k <= 10; k++) {
        content = `Complete the task${k}`;
        description = `This info is about task${k}`;
        project_id = j_count;
        taskArray.push([content, description, due_date, create_at, project_id]);
        if (taskArray.length === m) {
          taskLists.push(taskArray);
          taskArray = [];
        }
      }
      j_count++;
    }
  }
  console.log(taskLists.length);

  // let c = 0;
  // let resultLists = taskLists.map((taskArray,index) =>{
  //     // console.log(taskArray.length);
  //     c+=1;
  // })
  // console.log(c);

  const firstHalf = (taskLists) => {
    let sql3 = `INSERT INTO TASKS(CONTENT,DESCRIPTION,DUE_DATE,CREATED_AT,PROJECT_ID) VALUES ?`;
    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          console.log(err.message);
          return;
        });
      }
      function batchInsert(index) {
        if (index >= taskLists.length) {
          return connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                console.log(err.message);
                return;
              });
            }
            console.log("Logged success!!");
          });
        }
        connection.query(sql3, [taskLists[index]], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.log(err.message);
              return;
            });
          } else {
            console.log(`"Batch ${index} inserted "`);
            console.log(result);
            batchInsert(index + 1);
          }
        });
      }
      batchInsert(0);
    });
  };

  let taskLists1 = taskLists.slice(0, 50);
  let taskLists2 = taskLists.slice(50, 100);
  firstHalf(taskLists1);

};



createTasks()


firstHalf(taskLists2);