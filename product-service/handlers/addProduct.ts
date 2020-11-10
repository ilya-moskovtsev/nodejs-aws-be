import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {corsHeaders} from "../constants/headers";
import {Client} from "pg";
import {v4 as uuidv4} from 'uuid';
import Validator from 'validatorjs';
import {productRules} from '../validation/ProductRules';

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {rejectUnauthorized: false},
    connectionTimeoutMillis: 5000
};

export async function addProduct(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);
    console.log('event.body', event.body);
    console.log('productRules', productRules);

    const parsedBody = JSON.parse(event.body);
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

    const {
        count,
        description,
        id,
        price,
        title,
        image_url,
        image_title
    } = parsedBody;

    const client = new Client(dbOptions);
    try {
        await client.connect();

        await client.query('BEGIN');

        const text = `insert into products (id, title, description, price, image_url, image_title)
                      values ($1, $2, $3, $4, $5, $6)
                      returning id;`;
        const values = [id || uuidv4(), title, description, price, image_url, image_title];
        const product = await client.query(text, values);

        console.log(product);

        await client.query(`
            insert into stocks (product_id, count)
            values ('${product.rows[0].id}', ${count});
        `);

        await client.query('COMMIT');

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(product.rows[0]),
        };
    } catch (err) {
        console.error('Error during database request execution:', err);
        await client.query('ROLLBACK');

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: 'Error during database request execution',
        };
    } finally {
        client.end();
    }
}