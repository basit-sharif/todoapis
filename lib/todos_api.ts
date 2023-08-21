import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha"
import * as apigwIntegrationv2 from "@aws-cdk/aws-apigatewayv2-integrations-alpha"

export class Step05V2LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbTable = new dynamodb.Table(this, "todoListTable", {
      partitionKey: {
        name: "PARTITION_KEY",
        type: dynamodb.AttributeType.STRING
      },
    });

    let getTodosLambdaFunc = new lambda.Function(this, "GetTodoLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "Gettodos.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });

    let httpApi = new apigwv2.HttpApi(this, "todoListApi", {
      apiName: "todoListApi",
      corsPreflight: {
        allowHeaders: ['Content-Type'],
        allowMethods: [
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.DELETE,
        ],
        allowOrigins: ['*'],
        allowCredentials: false,
      },
    });
    let getTodosLambdaIntegration = new apigwIntegrationv2.HttpLambdaIntegration("todoGetIntegration", getTodosLambdaFunc);
    httpApi.addRoutes({
      path: "/gettodos",
      methods: [apigwv2.HttpMethod.GET],
      integration: getTodosLambdaIntegration
    })
    dbTable.grantFullAccess(getTodosLambdaFunc)

  }
}
