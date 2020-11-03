import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {getAllProductsWithDelay} from "service/products";

export async function getProductsList(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    try {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(await getAllProductsWithDelay(40)),
        };
    } catch (e) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: "Products not found",
        };
    }
}