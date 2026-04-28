import {inngest} from "../client";

export const helloWorld = inngest.createFunction(
  {id: "hello-world", triggers: {event: "test/hello.world"}},
  async ({event, step}) => {
    await step.sleep("process", "10s");

    await step.sleep("parse", "10s");

    await step.sleep("sending-to-ai", "10s");

    await step.run("create-interview", () => {
      return {message: "Hello World"};
    });
  },
);
