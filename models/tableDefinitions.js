import db from './connectDatabase.js'
import {eq,sql} from "drizzle-orm"
import { mysqlTable, varchar, boolean, serial,int,text, tinyint, date } from "drizzle-orm/mysql-core";


// console.log(db);

export const users = mysqlTable('USERS',{
  id : int('ID').primaryKey().notNull().autoincrement() ,
  name: text('NAME').notNull(),
  email: varchar('EMAIL',{length: 50}).notNull().unique()
})


export const projects = mysqlTable('PROJECTS',{
  id: int('ID').notNull().primaryKey().autoincrement(),
  name: varchar('NAME_',{length: 150 }).notNull().unique(),
  color: varchar('COLOR',{length: 50 }).notNull().default('WHITE'),
  is_favourite: tinyint('IS_FAVOURITE').default(0),
  user_id: int('USER_ID').notNull().references(()=>users.id)
})


export const tasks = mysqlTable('TASKS',{
  id: int('ID').notNull().primaryKey().autoincrement(),
  content: text('CONTENT').notNull(),
  description: text('DESCRIPTION').notNull() ,
  due_date: date('DUE_DATE').notNull() ,
  is_completed: tinyint('IS_COMPLETED').notNull().default(0) ,
  created_at: date('CREATED_AT').notNull().default(sql`CURDATE()`) ,
  project_id : int('PROJECT_ID').notNull().references(()=>projects.id) ,
})


