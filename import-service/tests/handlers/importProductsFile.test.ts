import {importProductsFile} from '../../handlers/importProductsFile';
import * as awsMock from 'aws-sdk-mock'
import {corsHeaders} from "../../constants/headers";

test('importProductsFile', async () => {
    awsMock.mock('S3', 'getSignedUrl', 'fileName');

    expect.assertions(1);
    const response = await importProductsFile(
        {
            queryStringParameters: {name: 'fileName'},
            body: null,
            headers: null,
            multiValueHeaders: null,
            httpMethod: null,
            multiValueQueryStringParameters: null,
            isBase64Encoded: null,
            path: null,
            pathParameters: null,
            requestContext: null,
            resource: null,
            stageVariables: null,
        },
        null);

    expect(response).toEqual({
        statusCode: 200,
        headers: corsHeaders,
        body: 'fileName'
    });

    awsMock.restore('S3');
});