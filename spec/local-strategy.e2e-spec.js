const { createApp } = require("./app");
const fastifyPassport = require("@fastify/passport");
const { LocalPasetoStrategy, fromAuthBearer } = require("../src");
const { V3 } = require("paseto");
const { expect } = require("chai");

describe("Local Strategy:e2e", function () {
  it("Get token from Authorization bearer", async () => {
    const app = await createApp();

    const key = await V3.generateKey("local");
    const token = await V3.encrypt(
      {
        username: "test",
      },
      key,
      {
        expiresIn: "99999999s",
      }
    );

    fastifyPassport.use(
      "local-paseto",
      new LocalPasetoStrategy(
        {
          getToken: fromAuthBearer(),
          key,
        },
        (payload, done) => {
          expect(payload.username).equal("test");
          done(null, { username: "username_test" });
        }
      )
    );

    app.get(
      "/test/bearer",
      {
        preValidation: fastifyPassport.authenticate("local-paseto", {
          authInfo: false,
          session: false,
        }),
      },
      async function (req, reply) {
        expect(req.user.username).equal("username_test");
        reply.send();
      }
    );

    await app.start();

    await app.inject({
      method: "GET",
      url: "/test/bearer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    app.close();
  });
});
