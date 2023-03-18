const fastify = require("fastify");
const cookie = require("@fastify/cookie");

const app = fastify({
  logger: {
    level: "error",
  },
});

app.register(cookie, {
  secret: "paseto",
  hook: "onRequest",
});

app.start = () =>
  new Promise((resolve) => {
    app.listen({ port: 3000 }, (err) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      resolve();
    });
  });

exports.app = app;
