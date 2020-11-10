import {Context, APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";
import {corsHeaders} from "../constants/headers";
import {Client} from "pg";

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

export async function getProductsList(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);

    const client = new Client(dbOptions);
    try {
        await client.connect();

        const text = `
            select count, description, p.id as id, price, title, image_url, image_title
            from products p
                     join stocks s on p.id = s.product_id;
        `;
        const {rows: products} = await client.query(text);
        console.log(products);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(products),
        };
    } catch (err) {
        console.error('Error during database request execution:', err);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: 'Error during database request execution',
        };
    } finally {
        client.end();
    }
}