import express, { Application, json } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, getAllDeveloper, getDeveloperById, updateDeveloperInfo } from "./logics/developers.logic";
import { ensureDeveloperExistsMiddleware, ensureEmailIsNew, ensureInfoDoenstExist } from "./middlewares/developers.middlewares";
import { createProject, createTechToProject, deleteProject, getAllProjects, getProjectById, updateProjectInfo } from "./logics/projects.logic";
import { ensureProjectExistsMiddleware, ensureTechExistsMiddleware } from "./middlewares/projects.middlewares";

const app: Application = express();

app.use(json());

app.post("/developers", ensureEmailIsNew, createDeveloper);
app.get("/developers/:id", ensureDeveloperExistsMiddleware, getDeveloperById);
app.get("/developers", getAllDeveloper);
app.patch("/developers/:id", ensureDeveloperExistsMiddleware, ensureEmailIsNew, updateDeveloperInfo);
app.delete("/developers/:id", ensureDeveloperExistsMiddleware, deleteDeveloper);
app.post("/developers/:id/infos", ensureDeveloperExistsMiddleware, ensureInfoDoenstExist, createDeveloperInfos);

app.post("/projects", ensureDeveloperExistsMiddleware, createProject);
app.get("/projects/:id", ensureProjectExistsMiddleware, getProjectById);
app.get("/projects", getAllProjects);
app.patch("/projects/:id", ensureProjectExistsMiddleware, ensureDeveloperExistsMiddleware, updateProjectInfo);
app.delete("/projects/:id", ensureProjectExistsMiddleware, deleteProject);
app.post("/projects/:id/technologies", ensureProjectExistsMiddleware, ensureTechExistsMiddleware, createTechToProject);
app.delete("/projects/:id/technologies/:name", ensureProjectExistsMiddleware);

export default app;
