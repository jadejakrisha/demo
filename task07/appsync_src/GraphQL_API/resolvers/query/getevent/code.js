import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached DynamoDB data source
 * @param {import('@aws-appsync/utils').Context} ctx
 * @returns {*} the request
 */
export function request(ctx) {
    return {
        operation: 'GetItem',
        key: { id: ctx.arguments.id }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx
 * @returns {*} the result
 */
export function response(ctx) {
    if (!ctx.result) {
        return null;
    }

    return {
        id: ctx.result.id,
        userId: ctx.result.userId,
        createdAt: ctx.result.createdAt,
        payLoad: JSON.parse(ctx.result.payLoad)
    };
}
