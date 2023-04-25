import J from 'joi';
import { handlerWrapper } from 'utils/wrapper';
import { signUp, login } from '../../services/auth/auth-service';

/**
 * Create a new users
 */
export const signUpHandler = handlerWrapper({ 
    cors: true,  
    validateBody: J.object({
        email: J.string().required(),
        password: J.string().required(),
    }),
}, async (event, manager) => {
        const { email, password } = event.body;
        const token = await signUp(email, password, manager);
        return { token };
});

/**
 * Validate user credentials and return a token
 */
export const loginHandler = handlerWrapper({ 
    cors: true,
    validateBody: J.object({
        email: J.string().required(),
        password: J.string().required(),
    }),
}, async (event, manager) => {
        const { email, password } = event.body;
        const token = await login(email, password, manager);
        return { token };
});