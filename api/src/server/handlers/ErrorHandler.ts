import { NextFunction, Request, Response, Application } from 'express';
import { HttpError } from "../../errors/HttpError";

export default function ErrorHandler(app: Application): void {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        let httpError: HttpError;

        if (error instanceof HttpError) {
            httpError = error;
        } else {
            httpError = new HttpError(500, error.message, (<any>error).validation);
        }
        if (error.name == "BadRequestError") {
            httpError.status = 400;
        }
        if (process.env.NODE_ENV != "unit-test") {
            console.error(error);
        }
        res.status(httpError.status).json({
            status: httpError.status,
            name: error.name,
            message: error.message,
            validation: httpError.validation
        });
    });
}