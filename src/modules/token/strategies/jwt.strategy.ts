import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from '@modules/token/token.service';
import { JwtInternalPayload } from '@modules/token/types';
import { TokenDocument } from '@modules/token/schemas/token.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private _TokenService: TokenService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: async (request, rawJwtToken, done) => {
                    const userPayload: JwtInternalPayload = this._TokenService.extractToken(rawJwtToken);
                    if (userPayload) {
                        const token: TokenDocument = await this._TokenService.findToken(userPayload.session);
                        if (token) {
                            done(null, token.privateKey);
                        } else {
                            done('Invalid token');
                        }
                    } else {
                        done('Invalid token');
                    }
                },
            },
            (payload, done) => {
                done(null, payload);
            },
        );
    }

    async validate(payload: any) {
        return payload;
    }
}
