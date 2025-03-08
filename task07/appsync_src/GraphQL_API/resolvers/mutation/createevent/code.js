import { util } from '@aws-appsync/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Sends a request to the attached DynamoDB data source
 * @param {import('@aws-appsync/utils').Context} ctx
 * @returns {*} the request
 */
export function request(ctx) {
    const { userId, payLoad } = ctx.arguments;

    return {
        operation: 'PutItem',
        key: { id: uuidv4() },
        attributeValues: {
            id: uuidv4(),
            userId: userId,
            createdAt: util.time.nowISO8601(),
            payLoad: JSON.stringify(payLoad)
        }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx
 * @returns {*} the result
 */
export function response(ctx) {
    return ctx.result;
}
