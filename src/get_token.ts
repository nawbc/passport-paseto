export const fromHeader = function (name: string = "X-Paseto-Token") {
  return (req) => req?.header?.[name];
};

export const fromCookie = function (name = "paseto_token") {
  return (req) => {
    req.cookies;
  };
};

export const fromAuthBearer = function () {
  return fromAuthScheme("Bearer");
};

export const fromAuthScheme = function (scheme: string) {
  return (req) => {
    const auth = req.headers["authorization"];

    const [prefix, token]: string[] = auth.split(/\W+/g);

    return prefix?.trim().toLowerCase() === scheme.toLowerCase() ? token : null;
  };
};

export const fromBody = function (field: string) {
  return (req) => req?.body[field];
};

export const fromQuery = function (field: string) {
  return (req) => req?.query[field];
};

export const fromCustom = function (field: string) {
  return (req) => req?.query[field];
};
