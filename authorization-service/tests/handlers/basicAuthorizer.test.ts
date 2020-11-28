import {APIGatewayAuthorizerEvent, Context} from "aws-lambda";
import * as handler from "../../handler";

describe('basicAuthorizer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test("success", async () => {
        const username = 'username';
        const password = 'password';

        process.env[username] = password;
        const testedModule = require('../../handler').basicAuthorizer;

        const plainCredentials = `${username}:${password}`;
        const buffer = Buffer.from(plainCredentials, 'utf-8');
        const encodedCredentials = buffer.toString('base64');

        const event = {
            type: "TOKEN",
            methodArn: 'arn',
            authorizationToken: `Basic ${encodedCredentials}`
        } as APIGatewayAuthorizerEvent;
        const context = {} as Context;

        const response = await testedModule(event, context);

        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toBe("string");
        expect(response.body).toBe(JSON.stringify({
            principalId: encodedCredentials,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: 'arn'
                    }
                ]
            }
        }));
    });

    test("when not token than 401 Unauthorized", async () => {
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

    test("when wrong credentials than 403 Unauthorized", async () => {
        // @ts-ignore
        const event = {
            type: "TOKEN",
            methodArn: 'arn',
            authorizationToken: 'Basic wrong_credentials'
        } as APIGatewayAuthorizerEvent;
        const context = {} as Context;

        const response = await handler.basicAuthorizer(event, context);

        expect(response.statusCode).toEqual(403);
        expect(response.body).toBe('Unauthorized');
    });
});
