export default class BadRequestError extends Error {

    constructor(error: string) {
        super(error);
        this.name = "BadRequestError";
    };

}