import { Request, Response } from "express";
import { TDevelopers, TDevelopersInfo, TDevelopersInfoRequest, TDevelopersRequest } from "../interfaces/developers.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerData: TDevelopersRequest = request.body;
    const queryString: string = format(
        `
        INSERT INTO
            developers (%I)
        VALUES
            (%L)
        RETURNING *;
        `,
        Object.keys(developerData),
        Object.values(developerData)
    );
    const queryResult: QueryResult<TDevelopers> = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (request: Request, response: Response): Promise<Response> => {
    const id = parseInt(request.params.id);
    const queryString: string = `
        SELECT
            developers."id" developerId,
            developers."name" developerName,
            developers."email" developerEmail,
            developer_infos."developerSince" developerInfoDeveloperSince,
            developer_infos."preferredOS" developerInfoPreferredOS
        FROM 
            developers
        LEFT JOIN
            developer_infos ON developers."id" = developer_infos."developerId"
        WHERE
            developers."id" = $1;
  `;
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
    return response.json(queryResult.rows[0]);
};

const getAllDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const queryString: string = `
        SELECT
            developers."id",
            developers."name",
            developers."email",
            developer_infos."developerSince",
            developer_infos."preferredOS"
        FROM 
            developers
        LEFT JOIN
            developer_infos ON developers."id" = developer_infos."developerId";
  `;
    const queryResult: QueryResult<TDevelopers> = await client.query(queryString);
    return response.json(queryResult.rows);
};

const updateDeveloperInfo = async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id);
    const developerData: Partial<TDevelopers> = request.body;
    const queryString = format(
        `
        UPDATE
            developers 
        SET (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(developerData),
        Object.values(developerData)
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
    return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id);
    const queryString = format(
        `
        DELETE FROM
            developers 
        WHERE
            id = $1
        RETURNING *;
        `
    );
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };
    const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
    return response.status(204).json(queryResult.rows[0]);
};

const createDeveloperInfos = async (request: Request, response: Response): Promise<Response> => {
    const infoData: TDevelopersInfoRequest = request.body;
    infoData.developerId = parseInt(request.params.id);
    const queryString: string = format(
        `
        INSERT INTO
            developer_infos (%I)
        VALUES
            (%L)
        RETURNING *;
        `,
        Object.keys(infoData),
        Object.values(infoData)
    );
    const queryResult: QueryResult<TDevelopersInfo> = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
};

export { createDeveloper, getDeveloperById, getAllDeveloper, updateDeveloperInfo, deleteDeveloper, createDeveloperInfos };
