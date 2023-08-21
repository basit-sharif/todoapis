import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function handler(req: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    // const reqBody = JSON.parse(req.body || "{}")
    // const partitionKey = reqBody.partitionKey;

    const params = {
        TableName: process.env.TABLE_NAME,
    };

    try {
        const Item = await dynamodb.scan(params).promise();
        return Item.Items
    } catch (error: any) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({ error: `${(error as { message: string }).message}` })
        }
        return response
    }
}