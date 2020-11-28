import {APIGatewayEvent, Context, SQSEvent} from "aws-lambda";
jest.mock("../clients/PostgresClient", () => {
    return {
        addProductToDb: () => {
            console.log('mocked addProductToDb');
            return Promise.resolve('mocked-product-id');
        }
    }
});
import * as handler from "../handler";
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";

test("getProductsList", async () => {
    const event = {body: "Test Body"} as APIGatewayEvent;
    const context = {} as Context;

    const response = await handler.getProductsList(event, context);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
});

test("getProductById", async () => {
    const event = {
        body: "Test Body",
        pathParameters: {}
    } as APIGatewayEvent;
    const context = {} as Context;

    const response = await handler.getProductById(event, context);

    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toBe("string");
});

test("catalogBatchProcess", async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('SNS', 'publish', () => {
        console.log('SNS', 'publish', 'mock called');
    })
    const product1 = '{"title":"Watch 10","description":"Watch Description 10","price":"12","count":"1","image_url":"https://source.unsplash.com/daily/?watch","image_title":"Watch Description 10"}';
    const product2 = '{"title":"Watch 12","description":"Watch Description 12","price":"18","count":"0","image_url":"https://source.unsplash.com/daily/?watch","image_title":"Watch Description 12"}';
    const record1 = {
        get body() {
            return product1;
        }
    };
    const record2 = {
        get body() {
            return product2;
        }
    };
    const spy1 = jest.spyOn(record1, 'body', 'get');
    const spy2 = jest.spyOn(record2, 'body', 'get');
    const event = {
        Records: [
            record1,
            record2
        ]
    } as SQSEvent;
    const context = {} as Context;
    console.log = jest.fn();

    await handler.catalogBatchProcess(event, context);

    expect(console.log).toBeCalledWith('event', event);
    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('mocked addProductToDb');
    expect(console.log).toBeCalledWith('TODO: mock SNS');

    AWSMock.restore('SNS');
});
