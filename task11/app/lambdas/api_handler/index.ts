import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const { httpMethod, path } = event;

    if (path === "/signin" && httpMethod === "POST") {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Sign-in successful!" }),
        };
    } else if (path === "/signup" && httpMethod === "POST") {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Sign-up successful!" }),
        };
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Route not found!" }),
        };
    }
}
