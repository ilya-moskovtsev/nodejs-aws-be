import {APIGatewayEvent, Context} from "aws-lambda";
import * as handler from "../../handler";

test("basicAuthorizer", async () => {
    const event = {body: "Test Body"} as APIGatewayEvent;
    const context = {} as Context;

    const response = await handler.basicAuthorizer(event, context);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
});
