import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha"
import * as apigwIntegrationv2 from "@aws-cdk/aws-apigatewayv2-integrations-alpha"

export class Step05V2LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // dynamodb connection
    const dbTable = new dynamodb.Table(this, "todoListTable", {
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
				name: "todoId",
				type: dynamodb.AttributeType.STRING,
			},
    });

    // lambda functions
    let getTodosLambdaFunc = new lambda.Function(this, "GetTodoLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "Gettodos.handler",
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });
    let postTodosLambdaFunc = new lambda.Function(this, "PostTodoLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "Posttodos.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    });
    let deleteTodosLambdaFunc = new lambda.Function(this, "DeleteTodosLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "Deletetodos.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    })
    let updateTodosLambdaFunc = new lambda.Function(this, "UpdateTodosLambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "Updatetodos.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: dbTable.tableName
      }
    })

    // apigateway to make http api for lambda function and allow methods and paths to intake
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

    // Api gateway integration with lambda to make route
    let getTodosLambdaIntegration = new apigwIntegrationv2.HttpLambdaIntegration("todoGetIntegration", getTodosLambdaFunc);
    let postTodosLambdaIntegration = new apigwIntegrationv2.HttpLambdaIntegration("todosPostIntegration", postTodosLambdaFunc)
    let deleteTodosLambdaIntegration = new apigwIntegrationv2.HttpLambdaIntegration("todoDeleteIntegration", deleteTodosLambdaFunc)
    let updateTodosLambdaIntegration = new apigwIntegrationv2.HttpLambdaIntegration("todosUpdateIntegration", updateTodosLambdaFunc);

    // add routes on gateway lambda integrated
    httpApi.addRoutes({
      path: "/gettodos",
      methods: [apigwv2.HttpMethod.GET],
      integration: getTodosLambdaIntegration
    });
    httpApi.addRoutes({
      path: "/posttodos",
      methods: [apigwv2.HttpMethod.POST],
      integration: postTodosLambdaIntegration,
    });
    httpApi.addRoutes({
      path: "/deletetodos",
      methods: [apigwv2.HttpMethod.DELETE],
      integration: deleteTodosLambdaIntegration,
    });
    httpApi.addRoutes({
      path: "/updatetodos",
      methods: [apigwv2.HttpMethod.PUT],
      integration: updateTodosLambdaIntegration,
    });

    // grant access to lambda function for dynamodb
    dbTable.grantFullAccess(getTodosLambdaFunc);
    dbTable.grantFullAccess(postTodosLambdaFunc);
    dbTable.grantFullAccess(deleteTodosLambdaFunc);
    dbTable.grantFullAccess(updateTodosLambdaFunc);

  }
}
