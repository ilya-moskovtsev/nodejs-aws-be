import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {corsHeaders} from "../constants/headers";
import {Client} from "pg";
import {v4 as uuidv4} from 'uuid';

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
    console.log(event);
    console.log(event.body);
    const {
        count,
        description,
        id,
        price,
        title,
        image_url,
        image_title
    } = JSON.parse(event.body);

    const client = new Client(dbOptions);
    await client.connect();

    try {
        await client.query('BEGIN');

        const product = await client.query(`
            insert into products (id, title, description, price, image_url, image_title)
            values ('${id || uuidv4()}',
                    '${title}',
                    '${description}',
                    ${price},
                    '${image_url}',
                    '${image_title}')
            returning id;
        `);

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