import * as lambda from 'aws-lambda';
import Joi from 'joi';
import { Connection, EntityManager } from 'typeorm';
import { Database } from 'db/Database';
import { validateToken } from 'services/auth/auth-service';

export interface HandlerWrapperOptions {
    validateToken: boolean;
    cors: boolean;
    validateBody: Joi.ObjectSchema<any>;
    validatePathParameters: Joi.ObjectSchema<any>;
    validateQueryStringParameters: Joi.ObjectSchema<any>;
}

export const successfulResponse = (body: object, statusCode = 200): lambda.APIGatewayProxyResult => {
    return { statusCode, body: JSON.stringify(body) };
};

export const addCorsResponseHeaders = (response: lambda.APIGatewayProxyResult): lambda.APIGatewayProxyResult => {
    return Object.assign({}, response, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    });
};

export const errorResponse = (errorMessage: string, statusCode = 500): lambda.APIGatewayProxyResult => {
    console.error('Error', errorMessage);
    return {
        statusCode,
        body: JSON.stringify({ error: errorMessage }),
    };
};

export const getHeaderToken = (headers: { [name: string]: string }): string => {
    if (!headers || !(headers.Authorization || headers.authorization)) {
        return null;
    }
    return headers.Authorization || headers.authorization;
};

export const handlerWrapper = (
    optionsParam: Partial<HandlerWrapperOptions>,
    handler: (
        event: {
            userId?: string;
            body?: Record<string, any>;
            pathParameters?: Record<string, any>;
            queryStringParameters?: Record<string, any>;
        },
        manager: EntityManager,
    ) => any,
): ((event: lambda.APIGatewayProxyEvent) => Promise<lambda.APIGatewayProxyResult>) => async (
    event: lambda.APIGatewayProxyEvent,
) => {
    const database = new Database();
    const handlerEvent: {
        userId?: string;
        body?: Record<string, any>;
        pathParameters?: Record<string, any>;
        queryStringParameters?: Record<string, any>;
    } = {};

    handlerEvent.pathParameters = event.pathParameters;
    handlerEvent.queryStringParameters = event.queryStringParameters;

    if (event.body) {
        handlerEvent.body = JSON.parse(event.body);
        if (optionsParam.validateBody) {
            const { error } = optionsParam.validateBody.validate(handlerEvent.body);
            if (error) {
                return errorResponse(error.message, 400);
            }
        }
    }

    if (optionsParam.validatePathParameters) {
        const { error } = optionsParam.validatePathParameters.validate(handlerEvent.pathParameters);
        if (error) {
            return errorResponse(error.message, 400);
        }
    }

    if (optionsParam.validateQueryStringParameters) {
        const { error } = optionsParam.validateQueryStringParameters.validate(handlerEvent.queryStringParameters);
        if (error) {
            return errorResponse(error.message, 400);
        }
    }

    try {
        const connection: Connection = await database.getConnection();
        const { manager } = connection;
        let res;
        if (optionsParam.validateToken) {
            const token = getHeaderToken(event.headers);
            const userId = await validateToken(token);
            res = await handler({ userId, ...handlerEvent }, manager);
        } else {
            res = await handler(handlerEvent, manager);
        }

        if (optionsParam.cors) {
            return addCorsResponseHeaders(await successfulResponse(res, 200));
        }
        return successfulResponse(res, 200);
    } catch (e) {
        if (optionsParam.cors) {
            return addCorsResponseHeaders(await errorResponse(e.message ? e.message : e, e.code ? e.code : 500));
        }
        return errorResponse(e.message ? e.message : e, e.code ? e.code : 500);
    }
};
