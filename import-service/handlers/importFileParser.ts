import {Context, S3Event} from "aws-lambda";
import AWS from 'aws-sdk';
import csv from 'csv-parser';

const BUCKET = 'ilymos-task-5';

export async function importFileParser(
    event: S3Event,
    context: Context
) {
    console.log('event', JSON.stringify(event, null, 2));
    try {
        const s3 = new AWS.S3({region: 'us-east-1'});
        for (const record of event.Records) {
            console.log("record.s3.object.key", record.s3.object.key);
            const s3Stream = s3.getObject({
                Bucket: BUCKET,
                Key: record.s3.object.key,
            }).createReadStream();

            await new Promise((resolve, reject) => {
                s3Stream.pipe(csv())
                    .on('data', (data) => console.log(data))
                    .on('error', (error) => {
                        console.error(error);
                        reject(error);
                    })
                    .on('end', async () => {
                        console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

                        await s3.copyObject({
                            Bucket: BUCKET,
                            CopySource: `${BUCKET}/${record.s3.object.key}`,
                            Key: record.s3.object.key.replace('uploaded', 'parsed'),
                        }).promise();

                        console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
                        resolve();
                    });
            });
        }
    } catch (err) {
        console.error('Failed to parse products file');
        console.error(err);
    }
}
