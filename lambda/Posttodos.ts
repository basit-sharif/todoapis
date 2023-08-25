import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');

export async function handler(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let reqBody = JSON.parse(req.body || "{}")
    let USER_ID = reqBody.userId;
    let TODO_NAME = reqBody.todoName;
    let CHECKED = false;
    let accessToken = reqBody.accessToken;

    function genrateUniqueIdForTodo() {
        const randomBytes = crypto.randomBytes(16); // 16 bytes = 128 bits
        return randomBytes.toString('hex');
    }

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            todoId: genrateUniqueIdForTodo(),
            userId: USER_ID,
            todoName: TODO_NAME,
            checked: CHECKED,
        },
    };

    if (accessToken === "basit-sharifbasitsharif35@gmail.com") {
        try {
            const res = await dynamodb.put(params).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Successfully added todo" })
            }

        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: (error as { message: string }).message })
            };
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "accessToken is invalid or required" })
        }
    }
}