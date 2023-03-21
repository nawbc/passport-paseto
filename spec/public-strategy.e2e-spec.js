const { createApp } = require("./app");
const fastifyPassport = require("@fastify/passport");
const { PublicPasetoStrategy, fromAuthBearer } = require("../src");
const { V3 } = require("paseto");
const { expect } = require("chai");

describe("Public Strategy:e2e", function () {
  it("Get token from Authorization bearer", async () => {
    const app = await createApp(4000);
    const { secretKey, publicKey } = await V3.generateKey("public", {
      format: "paserk",
    });
    const token = await V3.sign(
      {
        username: "test",
      },
      secretKey,
      {
        expiresIn: "99999999s",
      }
    );

    fastifyPassport.use(
      "public-paseto",
      new PublicPasetoStrategy(
        {
          getToken: fromAuthBearer(),
          publicKey,
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
        preValidation: fastifyPassport.authenticate("public-paseto", {
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
