import { Strategy } from "passport-strategy";
import { ExtractPasetoWays } from "./extract";

export interface PasetoStrategyOptions {
  extract?: ExtractPasetoWays;
}

export class PasetoStrategy extends Strategy {
  public readonly name = "paseto";

  constructor(options) {
    super();
  }

  override authenticate(req: any, options: any = {}): void {}
}
