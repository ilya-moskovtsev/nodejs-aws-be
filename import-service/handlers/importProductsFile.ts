import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {corsHeaders} from "../constants/headers";
import {S3} from 'aws-sdk';

const BUCKET = 'ilymos-task-5';

export async function importProductsFile(
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    console.log('event', event);
    const name = event.queryStringParameters.name;
    console.log('name', name);

    if (!name) {
        const errorMessage = `Query parameter name is missing`;
        console.error('errorMessage', errorMessage);

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: errorMessage,
        };
    }

    try {
        const filePath = `uploaded/${name}`;

        const s3 = new S3({region: 'us-east-1'});
        const params = {
            Bucket: BUCKET,
            Key: filePath,
            Expires: 60,
            ContentType: 'text/csv',
        };

        return new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }

                resolve({
                    statusCode: 200,
                    headers: corsHeaders,
                    body: url,
                });
            });
        });
    } catch (err) {
        const errorMessage = 'Failed to import products file';
        console.error(errorMessage);
        console.error(err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: errorMessage,
        };
    }
}