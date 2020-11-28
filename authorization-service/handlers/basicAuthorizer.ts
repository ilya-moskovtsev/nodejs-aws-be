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

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: 'body',
    };
}