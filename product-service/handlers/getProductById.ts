import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {getProductByIdWithDelay} from "service/products";

export async function getProductById(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    try {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(await getProductByIdWithDelay(event.pathParameters.id, 10)),
        };
    } catch (e) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: "Product not found",
        };
    }
}