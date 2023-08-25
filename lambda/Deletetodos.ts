import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "aws-sdk"

const dynamodb = new AWS.DynamoDB.DocumentClient()

interface paramsType {
    TableName: any,
    Key: any
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const reqBody = JSON.parse(event.body || "{}");
    const TODO_ID = reqBody.todoId;
    const USER_ID = reqBody.userId;

    const params: paramsType = {
        TableName: process.env.TABLE_NAME,
        Key: {
            todoId: TODO_ID,
            userId: USER_ID,
        },
    }

    try {
        await dynamodb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Successfully deleted ${TODO_ID}` })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: (error as { message: string }).message })
        }
    }

}