import db from "./connectDatabase.js";
import { eq, sql, lt, and } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  boolean,
  serial,
  int,
  text,
  tinyint,
  date,
} from "drizzle-orm/mysql-core";
import { users, tasks, projects } from "./tableDefinitions.js";
import e from "express";

export const getOne = async (projectId) => {
  const result = db.select().from(projects).where(eq(projects.id, projectId));
  return result;
};

export const createOne = async (projectData) => {
  const result = await db.insert(projects).values(projectData).$returningId();
  console.log(result);
  return result;
};

export const updateOne = async (id, projectData) => {
  const result = await db
    .update(projects)
    .set(projectData)
    .where(eq(projects.id, id));
  console.log(result);
  return result;
};

export const deleteOne = async (id) => {
  const result = await db.delete(projects).where(eq(projects.id, id));
  console.log(result);
  return result;
};

export const deletAll = async () => {
  const result = await db.delete(projects);
  return result;
};

export const updateIsFavourite = async (id, isFavouriteData) => {
  const result = await db
    .update(projects)
    .set(isFavouriteData)
    .where(eq(projects.id, id));
  console.log(result);
  return result;
};

export const getAllTasks = async () => {
  const result = await db.select().from(tasks).limit(100);
  console.log(result);
  return result;
};

export const getOneTasks = async (taskId) => {
  const result = await db.select().from(tasks).where(eq(tasks.id, taskId));
  console.log(result);
  return result;
};

export const createTask = async (taskData) => {
  const result = await db.insert(tasks).values(taskData).$returningId();
  console.log(result);
  return result;
};

export const editTask = async (taskId, taskData) => {
  const result = await db
    .update(tasks)
    .set(taskData)
    .where(eq(tasks.id, taskId));
  console.log(result);
  return result;
};

export const deleteTask = async (taskId) => {
  const result = await db.delete(tasks).where(eq(tasks.id, taskId));
  console.log(result);
  return result;
};

export const getTaskByProjectId = async (projectId) => {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.project_id, projectId));
  console.log(result);
  return result;
};

const resultTask = {
  id: tasks.id,
  content: tasks.content,
  description: tasks.description,
  due_date: tasks.due_date,
  is_completed: tasks.is_completed,
  created_at: tasks.created_at,
  project_id: tasks.project_id,
};

export const getTaskByIsCompleted = async (userId, isCompleted) => {
  const result = await db
    .select(resultTask)
    .from(tasks)
    .innerJoin(projects, eq(projects.id, tasks.project_id))
    .where(
      and(eq(projects.user_id, userId), eq(tasks.is_completed, isCompleted))
    );

  console.log(result);
  return result;
};

export const getTaskByDueDate = async (userId, dueDate) => {
  const result = await db
    .select(resultTask)
    .from(tasks)
    .innerJoin(projects, eq(projects.id, tasks.project_id))
    .where(and(eq(projects.user_id, userId), lt(tasks.due_date, dueDate)));
  console.log(result);
  return result;
};

export const getTaskByCreatedAt = async (userId, createdAt) => {
  const result = await db
    .select(tasks)
    .from(tasks)
    .innerJoin(projects, eq(projects.id, tasks.project_id))
    .where(and(eq(projects.user_id, userId), eq(tasks.created_at, createdAt)));
  console.log(result);
  return result;
};

let taskData = {
  content: "updated task content",
  description: "updated description",
  due_date: "2025-05-14",
  is_completed: 0,
  created_at: "2025-03-23",
};
