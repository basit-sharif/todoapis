import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function handler(req: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    let paramsValue = req.queryStringParameters || undefined;

    if (paramsValue?.accessToken == "basit-sharifbasitsharif35@gmail.com") {
        if (paramsValue?.userId) {
            try {
                const params = {
                    TableName: process.env.TABLE_NAME,
                    KeyConditionExpression: "#ui = :ui",
                    ExpressionAttributeNames: {
                        "#ui": "userId",
                    },
                    ExpressionAttributeValues: {
                        ":ui": paramsValue?.userId,
                    },
                };

                const getItemResult = await dynamodb.query(params).promise();

                return getItemResult.Items
            } catch (error) {
                const response = {
                    statusCode: 500,
                    body: JSON.stringify({ error: `${(error as { message: string }).message}` })
                }
                return response
            }
        } else {
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
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Invalid access token or provide accessToken" })
        }
    }
}