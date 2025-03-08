import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source (DynamoDB)
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    return {
        operation: "GetItem",
        key: {
            id: util.dynamodb.toDynamoDBJson(ctx.args.id)
        }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
    if (!ctx.result) {
        return util.error("Event not found", "NotFoundError");
    }

    return ctx.result;
}
