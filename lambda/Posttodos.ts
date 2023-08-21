import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function handler(req: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let reqBody = JSON.parse(req.body || "{}")
    let PARTITION_KEY = reqBody.partitionKey;
    let TODO_NAME = reqBody.todoName;
    let CHECKED = false;

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            PARTITION_KEY: PARTITION_KEY,
            TODO_NAME: TODO_NAME,
            CHECKED: CHECKED,
        }
    }



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
        }

    }
}