import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {getProductsByIdWithDelay} from "service/products";

export async function getProductsById(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    try {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(await getProductsByIdWithDelay(event.pathParameters.id, 10)),
        };
    } catch (e) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: "Product not found",
        };
    }
}