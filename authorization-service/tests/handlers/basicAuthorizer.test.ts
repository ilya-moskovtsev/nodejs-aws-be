import {APIGatewayAuthorizerEvent, Context} from "aws-lambda";
import * as handler from "../../handler";

test("basicAuthorizer", async () => {
    const event = {
        type: "TOKEN",
        methodArn: 'arn',
        authorizationToken: 'test'
    } as APIGatewayAuthorizerEvent;
    const context = {} as Context;

    const response = await handler.basicAuthorizer(event, context);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
});

test("401 Unauthorized", async () => {
    // @ts-ignore
    const event = {
        type: "NOT_TOKEN",
        methodArn: 'arn',
        authorizationToken: 'test'
    } as APIGatewayAuthorizerEvent;
    const context = {} as Context;

    const response = await handler.basicAuthorizer(event, context);

    expect(response.statusCode).toEqual(401);
    expect(response.body).toBe('Unauthorized');
});
