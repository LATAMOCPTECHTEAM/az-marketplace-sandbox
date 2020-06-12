/**
 * @swagger
 * components:
 *   schemas:
 *     InternalServerError:
 *      type: "object"
 *      properties:
 *        error:
 *          type: object
 *          properties:
 *            code:
 *              type: "string"
 *              example: "UnexpectedError"
 *            message:
 *              type: "string"
 *              example: "An unexpected error has occurred."
*/
export default interface IInternalServerErrorResponse {
    error: IInternalServerError;
}
export interface IInternalServerError {
    code: string;
    message: string;
}