import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {corsHeaders} from "../constants/headers";
import Validator from 'validatorjs';
import {productRules} from '../validation/ProductRules';
import {addProductToDb} from "../clients/PostgresClient";

export async function addProduct(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);
    console.log('event.body', event.body);
    console.log('productRules', productRules);

    const parsedBody: Product = JSON.parse(event.body);
    const validation = new Validator(parsedBody, productRules);

    if (validation.fails()) {
        const errorMessage = `Product not valid`;
        const errors = validation.errors.all()
        console.log(errorMessage, errors)

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({errorMessage, errors}),
        };
    }

    const newProductId = await addProductToDb(parsedBody);
    console.log('newProductId', newProductId);
    if (newProductId) {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: newProductId,
        };
    } else {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: 'Error during database request execution',
        };
    }
}