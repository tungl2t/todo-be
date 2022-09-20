import jwt from 'jsonwebtoken';

import { IHelperJwtOptions, IHelperJwtVerifyOptions } from '../interfaces';

export class TokenHelper {
  public static jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions) {
    return jwt.sign(payload, options.secretKey, {
      expiresIn: options.expiredIn,
      notBefore: options.notBefore || 0,
    });
  }

  public static jwtDecrypt(token: string): Record<string, any> {
    return jwt.decode(token) as Record<string, any>;
  }

  public static jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean {
    try {
      jwt.verify(token, options.secretKey, {
        audience: options.audience,
        issuer: options.issuer,
        subject: options.subject,
      });
      return true;
    } catch (err: any) {
      return false;
    }
  }
}
