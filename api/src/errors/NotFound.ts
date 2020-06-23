export default class NotFoundError extends Error {

    constructor(error: string) {
        super(error);
        this.name = "NotFoundError";
    };

}