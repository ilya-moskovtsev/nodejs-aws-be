import {APIGatewayEvent, Context, SQSEvent} from "aws-lambda";
import * as handler from "../handler";
import {Client} from "pg";

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
    const record1 = {
        get body() {
            return '{"title":"Watch 10","description":"Watch Description 10","price":"12","count":"1","image_url":"https://source.unsplash.com/daily/?watch","image_title":"Watch Description 10"}'
        }
    };
    const record2 = {
        get body() {
            return '{"title":"Watch 12","description":"Watch Description 12","price":"18","count":"0","image_url":"https://source.unsplash.com/daily/?watch","image_title":"Watch Description 12"}'
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
    Client.connect = jest.fn();
    Client.query = jest.fn();
    Client.end = jest.fn();

    await handler.catalogBatchProcess(event, context);

    expect(spy1).toBeCalledTimes(1);
    expect(spy2).toBeCalledTimes(1);
});
