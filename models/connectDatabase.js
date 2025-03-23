import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "joe",
  password: "Apples3$",
  database: "TODOIST",
});

const db = drizzle({ client: connection });

export default db;
