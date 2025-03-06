const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new DynamoDBClient({ region: "us-east-1" }); // Change region if needed
const TABLE_NAME = "Events";

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        if (!requestBody.principalId || !requestBody.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields: principalId or content" }),
            };
        }

        const createdAt = new Date().toISOString();
        const eventId = uuidv4();

        const newEvent = {
            id: { S: eventId },
            principalId: { N: requestBody.principalId.toString() },
            createdAt: { S: createdAt },
            body: { S: JSON.stringify(requestBody.content) }
        };

        await dynamoDB.send(new PutItemCommand({
            TableName: TABLE_NAME,
            Item: newEvent
        }));

        return {
            statusCode: 201,
            body: JSON.stringify({
                id: eventId,
                principalId: requestBody.principalId,
                createdAt,
                body: requestBody.content
            }),
        };
    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
