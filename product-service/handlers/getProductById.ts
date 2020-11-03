import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {getProductByIdWithDelay} from "service/products";
import {corsHeaders} from "../constants/headers";

export async function getProductById(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    try {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(await getProductByIdWithDelay(event.pathParameters.id, 10)),
        };
    } catch (e) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: "Product not found",
        };
    }
}