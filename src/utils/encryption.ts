import bcrypt from 'bcryptjs';

/**
 * Hash a text
 * @param text The text that you want to hash
 */
export const hash = async (text: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(text, salt);
};
