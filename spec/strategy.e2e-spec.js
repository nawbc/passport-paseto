const { app } = require("./app");

describe("Strategy", function () {
  it("Get token from cookie", async () => {
    app.get("/test", async function (req, reply) {
      reply.send();
    });

    await app.start();

    await app.inject({
      method: "GET",
      url: "/test",
      headers: {
        cookie: `paseto_token=${app.signCookie("paseto")}`,
        Authorization: "111",
      },
    });

    app.close();
  });

  after(app.close);
});
