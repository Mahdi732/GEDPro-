import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

const cookieExtractor = (req: any) => {
  if (!req) return null;
  // express `req.cookies` if cookie-parser is used
  if (req.cookies && req.cookies.accessToken) return req.cookies.accessToken;

  // GraphQL context might place req on different spots
  if (req.headers && req.headers.cookie) {
    const raw = req.headers.cookie;
    const match = raw.split(';').map((c: string) => c.trim()).find((c: string) => c.startsWith('accessToken='));
    if (match) return decodeURIComponent(match.split('=')[1]);
  }

  // Fallback to undefined
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_this_secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role };
  }
}
