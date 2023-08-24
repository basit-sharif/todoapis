import * as AWS from "aws-sdk"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    let reqBody = JSON.parse(event.body || "{}")
    const PARTITION_KEY = reqBody.partitionKey;
    const ID = reqBody.id;
    const checked = reqBody.checked;

    let params: any = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PARTITION_KEY: PARTITION_KEY,
            ID:ID
        },
        UpdateExpression: "SET CHECKED = :isCheckedValue",
        ExpressionAttributeValues: {
            ":isCheckedValue": checked,
        },
        ReturnValues: "ALL_NEW",
    };


    try {
        await dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Successfully Updated from ${!checked} to ${checked} of this field ${PARTITION_KEY}` })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as { message: string }).message }),
        }
    }
}