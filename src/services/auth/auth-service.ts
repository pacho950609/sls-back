import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { User } from 'entities/User';
import { hash } from '../../utils/encryption';

const { HASH_KEY } = process.env

/**
 * Validate if it's a valid token
 * @param token
 * @returns
 */
export const validateToken = (token: string) => {
    const user = jwt.verify(token, HASH_KEY) as { id: string };
    return user.id;
};

/**
 * Create a new user
 * @param email
 * @param password
 * @param manager
 * @returns
 */
export const signUp = async (email: string, password: string, manager: EntityManager) => {
    const user = await manager.findOne(User, {
        email,
    });

    if (user) {
        throw new Error('User already exist');
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = await hash(password);
        await manager.save(newUser);
        return jwt.sign({ id: newUser.id }, HASH_KEY);
    }
};

/**
 * Validate user credentials and return a token
 * @param email
 * @param password
 * @param manager
 * @returns user token
 */
export const login = async (email: string, password: string, manager: EntityManager) => {
    const user = await manager.findOne(User, {
        email,
    });

    if (user && bcrypt.compareSync(password, user.password)) {
        return jwt.sign({ id: user.id }, HASH_KEY);
    }
    throw new Error('Wrong user or password');
};
