import {APIGatewayTokenAuthorizerEvent, Context} from "aws-lambda";

export function basicAuthorizer(
    event: APIGatewayTokenAuthorizerEvent,
    context: Context,
    callback
) {
    console.log('event', event);
    console.log(process.env.ilya_moskovtsev);

    if (event['type'] !== 'TOKEN') {
        console.log('401 Unauthorized');
        callback('Unauthorized');
        return;
    }

    try {
        const authorizationToken = event.authorizationToken;

        const [scheme, encodedCredentials] = authorizationToken.split(' ');
        if (scheme !== 'Basic' || !encodedCredentials) {
            console.log('401 Unauthorized');
            callback('Unauthorized');
            return;
        }
        const buffer = Buffer.from(encodedCredentials, 'base64');
        const [username, password] = buffer.toString('utf8').split(':');
        console.log(`username: ${username} and password: ${password}`);

        const storedUsername = process.env[username];
        const effect = !storedUsername || storedUsername !== password ? 'Deny' : 'Allow';
        console.log(`effect: ${effect}`);

        const policy = generatePolicy(encodedCredentials, event.methodArn, effect);
        console.log(`policy: ${JSON.stringify(policy)}`);

        callback(null, policy);
    } catch (e) {
        callback(`Error: ${e.message}`);
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
