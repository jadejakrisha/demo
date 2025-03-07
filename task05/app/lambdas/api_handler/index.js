import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB Client
const dynamoDBClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME || "Events";

export const handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));

        let inputEvent;
        try {
            inputEvent = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            console.error("Error parsing event body:", parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid JSON format in request body" })
            };
        }

        // Validate required fields
        if (!inputEvent?.principalId || inputEvent?.content === undefined) {
            console.error("Validation failed: Missing required fields", inputEvent);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid input: principalId and content are required" })
            };
        }

        const eventId = uuidv4();
        const createdAt = new Date().toISOString();

        const eventItem = {
            id: eventId,
            principalId: Number(inputEvent.principalId),
            createdAt,
            body: typeof inputEvent.content === "object" ? inputEvent.content : { value: inputEvent.content }
        };

        console.log("Saving to DynamoDB:", JSON.stringify(eventItem, null, 2));

        // Save to DynamoDB
        await dynamoDBClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: eventItem,
        }));

        console.log("Saved successfully");

        // Correctly formatted response
        return {
            statusCode: 201,
            body: JSON.stringify(eventItem)
        };

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message })
        };
    }
};
