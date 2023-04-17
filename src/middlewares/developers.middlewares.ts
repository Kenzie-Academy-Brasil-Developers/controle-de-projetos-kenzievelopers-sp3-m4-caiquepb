import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { TDevelopers, TDevelopersInfo } from "../interfaces/developers.interface";
import { client } from "../database";
import format from "pg-format";

const ensureDeveloperExistsMiddleware = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    let id = parseInt(request.params.id);
    if (request.route.path === "/projects" && request.method === "POST") {
        id = request.body.developerId;
    }
    const queryString: string = `
        SELECT
          *
        FROM
          developers
        WHERE
          id = $1;
    `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
    if (queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Developer not found.",
        });
    }
    return next();
};

const ensureEmailIsNew = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const emailData = request.body.email;
    let emailCheck = false;
    const queryString: string = `
        SELECT
          email
        FROM
          developers;
    `;
    const queryResult: QueryResult = await client.query(queryString);
    queryResult.rows.some((email) => {
        if (email.email === emailData) {
            emailCheck = true;
        }
    });
    if (emailCheck) {
        return response.status(409).json({
            message: "Email already exists.",
        });
    }
    return next();
};

const ensureInfoDoenstExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const id = request.params.id;
    const infoData = request.body;
    const queryString: string = format(
        `
        SELECT
            developer_infos."developerSince"
        FROM 
            developers
        LEFT JOIN
            developer_infos ON developers."id" = developer_infos."developerId"
        WHERE
            developers."id" = $1;
        `,
        Object.keys(infoData),
        Object.values(infoData)
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult = await client.query(queryConfig);
    if (queryResult.rows[0].developerSince === null) {
        return next();
    }
    return response.status(409).json({
        message: "Developer infos already exists.",
    });
};

export { ensureDeveloperExistsMiddleware, ensureEmailIsNew, ensureInfoDoenstExist };
