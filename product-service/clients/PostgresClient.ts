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

export async function addProductToDb(product: Product): Promise<string> {
    console.log(`Will add ${JSON.stringify(product)} to db`);
    const client = new Client(dbOptions);
    try {
        await client.connect();

        await client.query('BEGIN');

        const text = `insert into products (id, title, description, price, image_url, image_title)
                      values ($1, $2, $3, $4, $5, $6)
                      returning id;`;
        const values = [product.id || uuidv4(), product.title, product.description, product.price, product.image_url, product.image_title];
        const result = await client.query(text, values);

        console.log(`result ${JSON.stringify(result)}`);

        await client.query(`
            insert into stocks (product_id, count)
            values ('${result.rows[0].id}', ${product.count});
        `);

        await client.query('COMMIT');

        console.log(`Successfully added product to db. New product id: ${result.rows[0].id}`);
        return result.rows[0].id;
    } catch (err) {
        console.error('Error during database request execution:', err);
        await client.query('ROLLBACK');

        return null;
    } finally {
        client.end();
    }
}