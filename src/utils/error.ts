export class StatusCodeError extends Error {
    code: number;

    constructor(errorMessage: string, code = 500) {
        super(errorMessage);
        this.code = code;
        this.message = errorMessage;
    }
}
