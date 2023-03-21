import { Strategy } from "passport-strategy";
import { ConsumeOptions, V3 } from "paseto";
import type { JsonWebKeyInput, KeyObject, PublicKeyInput } from "crypto";

type CustomPasetoTokenFromProvider = (
  req: any,
  options?: PublicPasetoStrategyOptions
) => string;

type Verified = (err: Error, user: Record<string, any>, info: any) => void;

export interface PublicPasetoStrategyOptions {
  getToken?: CustomPasetoTokenFromProvider;
  publicKey?: KeyObject | Buffer | PublicKeyInput | JsonWebKeyInput | string;
  pasetoOptions?: ConsumeOptions<any>;
  passReqToCallback?: boolean;
}

export class PublicPasetoStrategy extends Strategy {
  public readonly name = "public-paseto";

  private options!: PublicPasetoStrategyOptions;
  private verify!: any;
  public static generateKey = V3.generateKey;

  constructor(
    options: PublicPasetoStrategyOptions,
    verify: (payload: any, verified: any) => void
  );
  constructor(
    options: PublicPasetoStrategyOptions = {},
    verify: (
      req: any,
      payload: Record<string, unknown>,
      verified: Verified
    ) => void
  ) {
    super();
    if (typeof verify !== "function") {
      throw new TypeError("LocalPasetoStrategy requires a verify callback");
    }

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
    _options: PublicPasetoStrategyOptions = {}
  ): Promise<void> {
    const token = await this.options.getToken(req);
    const payload = await V3.verify(
      token,
      this.options.publicKey,
      this.options.pasetoOptions
    ).catch(this.fail);

    this.verified = this.verified.bind(this);

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
