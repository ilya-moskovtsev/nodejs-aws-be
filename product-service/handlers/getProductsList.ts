import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {getAllProductsWithDelay} from "service/products";
import {corsHeaders} from "../constants/headers";

export async function getProductsList(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    try {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(await getAllProductsWithDelay(40)),
        };
    } catch (e) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: "Products not found",
        };
    }
}