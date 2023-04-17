import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TProjects, TTechRequest } from "../interfaces/projects.interface";

const ensureProjectExistsMiddleware = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    let id = parseInt(request.params.id);
    const queryString: string = `
        SELECT
          *
        FROM
          projects
        WHERE
          id = $1;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TProjects> = await client.query(queryConfig);
    if (queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Project not found.",
        });
    }
    return next();
};

const ensureTecExistsMiddleware = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const techData: TTechRequest = request.body;
    let techCheck = false;
    const queryString: string = `
        SELECT
            *
        FROM
            technologies
  `;
    const queryResult: QueryResult = await client.query(queryString);
    queryResult.rows.some((techs) => {
        if (techs.name === techData.name) {
            techCheck = true;
            response.locals.tech = techs.id;
        }
    });
    if (techCheck) {
        return next();
    }
    return response.status(404).json({
        message: "Technology not found.",
    });
};

export { ensureProjectExistsMiddleware, ensureTecExistsMiddleware };
