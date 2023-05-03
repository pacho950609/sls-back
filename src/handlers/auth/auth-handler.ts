import J from 'joi';
import { handlerWrapper } from 'utils/wrapper';
import { signUp, login } from '../../services/auth/auth-service';

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
