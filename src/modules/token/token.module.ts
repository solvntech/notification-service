import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
    ExtractTokenHandler,
    FindTokenHandler,
    GenerateTokenHandler,
    ProvideNewTokenHandler,
    RemoveTokenHandler,
    VerifyTokenHandler,
} from './commands';
import { ClearTokenCron } from './cron/clear-token.cron';
import { Token, TokenSchema } from './schemas/token.schema';

const handlers = [
    GenerateTokenHandler,
    RemoveTokenHandler,
    ExtractTokenHandler,
    FindTokenHandler,
    ProvideNewTokenHandler,
    VerifyTokenHandler,
];

@Module({
    providers: [...handlers, TokenService, JwtStrategy, ClearTokenCron],
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        JwtModule.register({}),
    ],
})
export class TokenModule {}
