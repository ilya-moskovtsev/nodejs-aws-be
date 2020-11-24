import {Context, SQSEvent} from "aws-lambda";
import AWS from "aws-sdk";
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

const sns = new AWS.SNS();

export async function catalogBatchProcess(
    event: SQSEvent,
    context: Context
) {
    console.log('event', event);
    try {
        await Promise.all(
            event.Records.map(async (record) => {
                const client = new Client(dbOptions);
                try {
                    const parsedProduct = JSON.parse(record.body);
                    const validation = new Validator(parsedProduct, productRules);
                    if (validation.fails()) {
                        throw new Error(
                            `validation of ${JSON.stringify(
                                parsedProduct
                            )} failed with errors: ${JSON.stringify(validation.errors.all())}`
                        );
                    }

                    console.log(`adding product ${JSON.stringify(parsedProduct)} to db`);
                    const {
                        count,
                        description,
                        id,
                        price,
                        title,
                        image_url,
                        image_title
                    } = parsedProduct;
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


                    return sns.publish({
                        Message: `product was created: ${JSON.stringify(parsedProduct)}`,
                        TopicArn: SNS_TOPIC_ARN,
                        MessageAttributes: {
                            count: {
                                DataType: 'Number',
                                StringValue: parsedProduct.count,
                            },
                        },
                    });
                } catch (error) {
                    console.log('error', error);
                    throw error;
                }
            })
        );

    } catch (e) {
        console.log('error', e);
        throw e;
    }
}