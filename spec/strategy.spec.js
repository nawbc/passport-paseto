const { LocalPasetoStrategy } = require("../src");
const { passport } = require("chai");
const { V3 } = require("paseto");

describe("Strategy", function () {
  it("demo", async () => {
    const key = await V3.generateKey("local");

    const r = await V3.encrypt(
      {
        name: "demo",
      },
      key,
      {
        expiresIn: "31220s",
      }
    );

    passport
      .use(
        new LocalPasetoStrategy(
          {
            getToken(req) {
              console.log(req);
              return r;
            },
            key: key,
          },
          (payload, done) => {
            console.log(rest);
            done(null, { name: 11 }, { demo: "11" });
          }
        )
      )
      .success((...r) => {
        console.log(r);
      });
  });
});
