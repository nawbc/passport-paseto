import { Strategy } from "passport-strategy";
import { ConsumeOptions, V3 } from "paseto";
import type { KeyObject } from "crypto";

type CustomPasetoTokenFromProvider = (
  req: any,
  options?: LocalPasetoStrategyOptions
) => string;

type Verified = (err: Error, user: Record<string, any>, info: any) => void;

export interface LocalPasetoStrategyOptions {
  getToken?: CustomPasetoTokenFromProvider;
  key?: KeyObject | Buffer | string;
  pasetoVerify?: ConsumeOptions<any>;
  passReqToCallback?: boolean;
}

export class LocalPasetoStrategy extends Strategy {
  public readonly name = "local-paseto";

  private options!: LocalPasetoStrategyOptions;
  private verify!: any;
  public static generateKey = V3.generateKey;

  constructor(
    options: LocalPasetoStrategyOptions,
    verify: (payload: any, verified: any) => void
  );
  constructor(
    options: LocalPasetoStrategyOptions = {},
    verify: (
      req: any,
      payload: Record<string, unknown>,
      verified: Verified
    ) => void
  ) {
    super();
    this.options = options;
    this.verify = verify;
  }

  private verified(err, user, info) {
    if (err) {
      return this.error(err);
    } else if (!user) {
      return this.fail(info);
    } else {
      return this.success(user, info);
    }
  }

  override async authenticate(
    req: any,
    _options: LocalPasetoStrategyOptions = {}
  ): Promise<void> {
    const token = await this.options.getToken(req);
    const payload = await V3.decrypt(
      token,
      this.options.key,
      this.options.pasetoVerify
    ).catch(this.fail);

    try {
      if (this.options.passReqToCallback) {
        this.verify(req, payload, this.verified);
      } else {
        this.verify(payload, this.verified);
      }
    } catch (err) {
      this.error(err);
    }
  }
}
