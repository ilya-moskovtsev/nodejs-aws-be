import {APIGatewayTokenAuthorizerEvent, Context} from "aws-lambda";
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
        } as APIGatewayTokenAuthorizerEvent;
        const context = {} as Context;

        testedModule(event, context, (arg1, arg2) => {
            expect(arg1).toBe(null);
            expect(arg2).toEqual({
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
            });
        });
    });

    test("when not token than 401 Unauthorized", async () => {
        // @ts-ignore
        const event = {
            type: "NOT_TOKEN",
            methodArn: 'arn',
            authorizationToken: 'test'
        } as APIGatewayTokenAuthorizerEvent;
        const context = {} as Context;

        handler.basicAuthorizer(event, context, (arg1, agr2?) => {
            expect(arg1).toBe('Unauthorized');
            expect(agr2).toBe(undefined);
        });

    });

    test("when wrong credentials than 403 Unauthorized", async () => {
        const username = 'username';
        const password = 'password';

        process.env[username] = password;
        const testedModule = require('../../handler').basicAuthorizer;

        const plainCredentials = `wrong${username}:wrong${password}`;
        const buffer = Buffer.from(plainCredentials, 'utf-8');
        const encodedCredentials = buffer.toString('base64');

        const event = {
            type: "TOKEN",
            methodArn: 'arn',
            authorizationToken: `Basic ${encodedCredentials}`
        } as APIGatewayTokenAuthorizerEvent;
        const context = {} as Context;

        testedModule(event, context, (arg1, arg2) => {
            expect(arg1).toBe(null);
            expect(arg2).toEqual({
                principalId: encodedCredentials,
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: 'Deny',
                            Resource: 'arn'
                        }
                    ]
                }
            });
        });
    });
});
