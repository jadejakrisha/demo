import { util } from '@aws-appsync/utils';

/**
 * Sends a request to the attached data source (DynamoDB)
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const { userId, payLoad } = ctx.args;

    return {
        operation: "PutItem",
        key: { id: util.autoId() },  // Generates a UUID for id
        attributeValues: {
            id: util.dynamodb.toDynamoDBJson(util.autoId()),
            userId: util.dynamodb.toDynamoDBJson(userId),
            createdAt: util.dynamodb.toDynamoDBJson(util.time.nowISO8601()),
            payLoad: util.dynamodb.toDynamoDBJson(payLoad)
        }
    };
}

/**
 * Returns the resolver result
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
    if (ctx.error) {
        return util.error(ctx.error.message, ctx.error.type);
    }

    return {
        id: ctx.result.id,
        createdAt: ctx.result.createdAt
    };
}
