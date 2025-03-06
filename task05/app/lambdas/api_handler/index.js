const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "cmtr-3908e2d8-Events-j8z8"; // Ensure this is the correct table name

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body); // Parse the request body

        // Validate required fields
        if (!requestBody.principalId || !requestBody.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields: principalId or content" }),
            };
        }

        // Construct the event object
        const newEvent = {
            id: uuidv4(), // Generate a UUID v4
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(), // ISO 8601 formatted timestamp
            body: requestBody.content, // Store content as body
        };

        // Save to DynamoDB
        await dynamoDB.put({
            TableName: TABLE_NAME,
            Item: newEvent,
        }).promise();

        // Return the created event
        return {
            statusCode: 201,
            body: JSON.stringify({ event: newEvent }),
        };

    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
