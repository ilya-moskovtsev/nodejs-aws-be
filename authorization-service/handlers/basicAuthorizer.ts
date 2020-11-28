import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {corsHeaders} from "../constants/headers";

export async function basicAuthorizer(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);
    console.log('event.body', event.body);
    console.log(process.env.ilya_moskovtsev);

    return {
        statusCode: 200,
        headers: corsHeaders,
        body: 'body',
    };
}