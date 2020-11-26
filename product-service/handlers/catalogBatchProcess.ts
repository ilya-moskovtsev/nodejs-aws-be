import {Context, SQSEvent} from "aws-lambda";
import AWS from "aws-sdk";
import {productRules} from "../validation/ProductRules";
import Validator from 'validatorjs';
import {addProductToDb} from "../clients/PostgresClient";

const sns = new AWS.SNS();

export async function catalogBatchProcess(
    event: SQSEvent,
    context: Context
) {
    console.log('event', event);
    try {
        await Promise.all(
            event.Records.map(async (record) => {
                try {
                    const parsedProduct: Product = JSON.parse(record.body);
                    const validation = new Validator(parsedProduct, productRules);
                    if (validation.fails()) {
                        throw new Error(
                            `validation of ${JSON.stringify(
                                parsedProduct
                            )} failed with errors: ${JSON.stringify(validation.errors.all())}`
                        );
                    }
                    const newProductId = await addProductToDb(parsedProduct);
                    if (newProductId) {
                        parsedProduct.id = newProductId;
                        const publishInput: AWS.SNS.Types.PublishInput = {
                            Message: `product was created: ${JSON.stringify(parsedProduct)}`,
                            TopicArn: process.env.SNS_TOPIC_ARN,
                            MessageAttributes: {
                                count: {
                                    DataType: 'Number',
                                    StringValue: parsedProduct.count.toString(),
                                },
                            },
                        };
                        return sns.publish(publishInput);
                    }
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