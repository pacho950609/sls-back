import J from 'joi';
import * as lambda from 'aws-lambda';
import { handlerWrapper } from 'utils/wrapper';
import { signUp, login } from '../../services/auth/auth-service';
import { parseTopicEvent, Topics } from '../../utils/aws/sns'
import { parseQueueMessage, Queues } from '../../utils/aws/sqs';
import papa from 'papaparse';

/**
 * @api {post} /signup Create user
 * @apiDescription Create a new user and return a token
 * @apiName signUpHandler
 * @apiGroup Auth
 * @apiHeader {String} Authorization User token
 * @apiBody {String} email User email 
 * @apiBody {String} password User password.
 * @apiParamExample {json} Body-Example:
 *  {
        email: "test@gmail.com",
        password: "test123"
 *  } 
 * @apiPermission Client
 * @apiSuccessExample Success-Response:
 * {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 * }  
 */
export const signUpHandler = handlerWrapper(
    {
        cors: true,
        validateBody: J.object({
            email: J.string().required(),
            password: J.string().required(),
        }),
    },
    async (event, manager) => {
        const { email, password } = event.body;
        const token = await signUp(email, password, manager);
        return { token };
    },
);

/**
 * @api {post} /login Login
 * @apiDescription Validate user credentials and return a token
 * @apiName loginHandler
 * @apiGroup Auth
 * @apiHeader {String} Authorization User token
 * @apiPermission Client
 * @apiBody {String} email User email 
 * @apiBody {String} password User password.
 * @apiParamExample {json} Body-Example:
 *  {
        email: "test@gmail.com",
        password: "test123"
 *  } 
 * @apiSuccessExample Success-Response:
 * {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 * }  
 */
export const loginHandler = handlerWrapper(
    {
        cors: true,
        validateBody: J.object({
            email: J.string().required(),
            password: J.string().required(),
        }),
    },
    async (event, manager) => {
        const { email, password } = event.body;
        const token = await login(email, password, manager);
        return { token };
    },
);

export const messageHandler = (lambdaEvent: lambda.SQSEvent) => {
    const message = parseQueueMessage(Queues.POTTER_QUEUE, lambdaEvent);
    console.log('message', message, message.id);
}

export const eventHandler = (lambdaEvent: lambda.SNSEvent) => {
    const event = parseTopicEvent(Topics.POTTER_TOPIC, lambdaEvent);
    console.log('event', event, event.id);
}

export const fileHandler = handlerWrapper(
    {
        cors: true,
        isFormData: true,
    },
    async (event, manager) => {
        const data = papa.parse(event?.body.file.content, { header: true }).data
        return { msg: 'ok', data}
    },
);