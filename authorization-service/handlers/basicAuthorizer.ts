import {APIGatewayAuthorizerEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {corsHeaders} from "../constants/headers";

export async function basicAuthorizer(
    event: APIGatewayAuthorizerEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);
    console.log(process.env.ilya_moskovtsev);

    if (event['type'] !== 'TOKEN') {
        console.log('401 Unauthorized');
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: 'Unauthorized',
        };
    }
    try {
        const authorizationToken = event.authorizationToken;

        const encodedCredentials = authorizationToken.split(' ')[1];
        const buffer = Buffer.from(encodedCredentials, 'base64');
        const [username, password] = buffer.toString('utf8').split(':');
        console.log(`username: ${username} and password: ${password}`);

        const storedUsername = process.env[username];
        const effect = !storedUsername || storedUsername !== password ? 'Deny' : 'Allow';

        if (effect === 'Deny') {
            return {
                statusCode: 403,
                headers: corsHeaders,
                body: `Unauthorized`,
            };
        }

        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(policy),
        };
    } catch (e) {
        return {
            statusCode: 401,
            headers: corsHeaders,
            body: `Unauthorized: ${e.message}`,
        };
    }

}

function generatePolicy(encodedCredentials: string, methodArn: string, effect: string = 'Deny') {
    return {
        principalId: encodedCredentials,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: methodArn
                }
            ]
        }
    }
}
