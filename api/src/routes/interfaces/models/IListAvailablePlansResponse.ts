/**
 * @swagger
 * components:
 *   schemas:
 *     ListAvailablePlansResponse:
 *      type: "object"
 *      properties:
 *        plans:
 *          type: "array"
 *          items:
 *            type: "object"
 *            properties:
 *              planId:
 *                type: "string"
 *              displayName:
 *                type: "string"
 *              isPrivate:
 *                type: "boolean"
 *          example:
 *            - planId: "Platinum001"
 *              displayName: "Private platinum plan for Contoso"
 *              isPrivate: true
 *            - planId: "gold"
 *              displayName: "Gold plan for Contoso"
 *              isPrivate: false
*/
export default interface IListAvailablePlans {
    plans: IAvailablePlan[]
}

export interface IAvailablePlan {
    planId: string,
    displayName: string,
    isPrivate: boolean
}