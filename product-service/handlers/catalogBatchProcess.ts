import {Context, SQSEvent} from "aws-lambda";
import AWS from "aws-sdk";
import {corsHeaders} from "../../import-service/constants/headers";
import {productRules} from "../validation/ProductRules";
import Validator from 'validatorjs';
import {Client} from "pg";
import {v4 as uuidv4} from 'uuid';

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, SNS_TOPIC_ARN} = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {rejectUnauthorized: false},
    connectionTimeoutMillis: 5000
};

export async function catalogBatchProcess(
    event: SQSEvent,
    context: Context
) {
    console.log('event', event);
    const products = event.Records.map(({body}) => body);
    const sns = new AWS.SNS();

    console.log('products', products);
    const promises = products.map(async (product) => {
        const parsedProduct = JSON.parse(product);
        const validation = new Validator(parsedProduct, productRules);

        if (validation.fails()) {
            const errorMessage = `Product not valid`;
            const errors = validation.errors.all()
            console.log(errorMessage, errors)
        } else {
            const {
                count,
                description,
                id,
                price,
                title,
                image_url,
                image_title
            } = parsedProduct;

            const client = new Client(dbOptions);
            try {
                await client.connect();

                await client.query('BEGIN');

                const text = `insert into products (id, title, description, price, image_url, image_title)
                              values ($1, $2, $3, $4, $5, $6)
                              returning id;`;
                const values = [id || uuidv4(), title, description, price, image_url, image_title];
                const product = await client.query(text, values);

                await client.query(`
            insert into stocks (product_id, count)
            values ('${product.rows[0].id}', ${count});
        `);

                await client.query('COMMIT');
            } catch (err) {
                console.error('Error during database request execution:', err);
                await client.query('ROLLBACK');
            } finally {
                client.end();
            }
        }
    });

    await Promise.all(promises);

    sns.publish({
        Subject: 'Products added',
        Message: JSON.stringify(products),
        TopicArn: SNS_TOPIC_ARN
    }, (err, data) => {
        if (err) {
            console.error('Error while publishing to topic', err);
        } else {
            console.log('Successfully published to topic', data);
        }
    });

    return {
        statusCode: 202,
        headers: corsHeaders,
        body: '',
    };
}