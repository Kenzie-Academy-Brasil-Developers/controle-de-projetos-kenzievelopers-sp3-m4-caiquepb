import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import { TProjects, TProjectsRequest, TTech } from "../interfaces/projects.interface";

const createProject = async (request: Request, response: Response): Promise<Response> => {
    const projectData: TProjectsRequest = request.body;
    const queryString: string = format(
        `
        INSERT INTO
            projects (%I)
        VALUES
            (%L)
        RETURNING *;
        `,
        Object.keys(projectData),
        Object.values(projectData)
    );
    const queryResult: QueryResult<TProjects> = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
};

const getProjectById = async (request: Request, response: Response): Promise<Response> => {
    const id = request.params.id;
    const queryString: string = format(
        `
        SELECT
            *
        FROM
            projects
        WHERE
            id = $1;
        `
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TProjects> = await client.query(queryConfig);
    return response.status(201).json(queryResult.rows[0]);
};

const getAllProjects = async (request: Request, response: Response): Promise<Response> => {
    const queryString: string = format(
        `
        SELECT
            *
        FROM
            projects;
        `
    );
    const queryResult: QueryResult<TProjects> = await client.query(queryString);
    return response.json(queryResult.rows);
};

const updateProjectInfo = async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id);
    const projectData: Partial<TProjects> = request.body;
    const queryString = format(
        `
        UPDATE
            projects 
        SET (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(projectData),
        Object.values(projectData)
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TProjects> = await client.query(queryConfig);
    return response.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id);
    const queryString = format(
        `
        DELETE FROM
            projects 
        WHERE
            id = $1
        RETURNING *;
        `
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TProjects> = await client.query(queryConfig);
    return response.status(204).json(queryResult.rows[0]);
};

const creteTechToProject = async (request: Request, response: Response): Promise<Response | void> => {
    const technologyId: number = parseInt(response.locals.tech);
    const projectId: number = parseInt(request.params.id);
    const addedIn: Date = new Date()
    console.log(addedIn);
    const data: TTech = {
        technologyId,
        projectId,
        addedIn
    };
    const queryString: string = format(
        `
        INSERT INTO
            projects_technologies(%I)
        VALUES(%L)
            RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    );
    const queryResult: QueryResult = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
};

export { createProject, getProjectById, getAllProjects, updateProjectInfo, deleteProject, creteTechToProject };
