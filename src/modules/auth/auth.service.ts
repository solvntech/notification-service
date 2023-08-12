import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AccountDto } from '@modules/user/dto/account.dto';
import { SuccessDto } from '@dto';
import { UserDocument } from '@modules/user/schemas/user.schema';
import { CreateUserCommand, FindUserByCommand } from '@modules/user/commands';
import {
    JwtInternalPayload,
    JwtPayload,
    PairSecretToken,
    PairSecretTokenType,
    RemoveTokenByType,
} from '@modules/token/types';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import {
    ExtractTokenCommand,
    FindTokenCommand,
    GenerateTokenCommand,
    ProvideNewTokenCommand,
    RemoveTokenCommand,
    VerifyTokenCommand,
} from '@modules/token/commands';
import { TokenDocument } from '@modules/token/schemas/token.schema';
import _ from 'lodash';

@Injectable()
export class AuthService {
    constructor(private _CommandBus: CommandBus) {}

    async createAccount(account: AccountDto): Promise<SuccessDto> {
        const existAccount: UserDocument = await this.findUserByEmail(account.email);

        if (existAccount) {
            throw new ConflictException('Duplicate account');
        }
        account.password = await BcryptHelper.hashPassword(account.password);
        const user: UserDocument = await this._CommandBus.execute(new CreateUserCommand(account));

        const payload: JwtPayload = {
            name: user.name,
            id: user._id.toString(),
            role: user.role,
            email: user.email,
        };

        // create jwt token
        const tokenObj: PairSecretToken = await this.generateToken(payload, true);

        if (tokenObj) {
            return new SuccessDto('Create account successfully', HttpStatus.CREATED, {
                ...payload,
                ...tokenObj,
            });
        }
        throw new InternalServerErrorException('Create account successfully but create token failed');
    }

    async validateUser(email: string, password: string): Promise<SuccessDto> {
        const currentAccount: UserDocument = await this.findUserByEmail(email);
        if (currentAccount) {
            if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                const payload: JwtPayload = {
                    name: currentAccount.name,
                    id: currentAccount._id.toString(),
                    role: currentAccount.role,
                    email: currentAccount.email,
                };

                // create jwt token
                const tokenObj: PairSecretToken = await this.generateToken(payload, true);

                if (tokenObj) {
                    return new SuccessDto('Login successfully', HttpStatus.OK, {
                        ...payload,
                        ...tokenObj,
                    });
                }
                throw new ConflictException('Account is logged');
            }
        }
        throw new BadRequestException('Email or password is incorrect');
    }

    private async findUserByEmail(email: string): Promise<UserDocument> {
        return this._CommandBus.execute(new FindUserByCommand({ email }));
    }

    async logout(refreshToken: string): Promise<SuccessDto> {
        const isSuccess: boolean = await this.removeToken('refreshToken', refreshToken);
        if (isSuccess) {
            return new SuccessDto('Logout successfully');
        }
        throw new BadRequestException('Invalid Token');
    }

    async handleRefreshToken(refreshToken: string): Promise<SuccessDto> {
        const userPayload: JwtInternalPayload = await this.extractToken(refreshToken);

        if (!userPayload) {
            throw new BadRequestException('Invalid Token');
        }

        const token: TokenDocument = await this.findToken(userPayload.session);

        if (!token) {
            throw new BadRequestException('Invalid Token');
        }

        if (_.includes(token.refreshTokenUsed, refreshToken)) {
            // remove token
            await this.removeToken('session', token.session);
            throw new BadRequestException('Account was stolen');
        }

        if (token.refreshToken !== refreshToken) {
            throw new BadRequestException('Invalid Token');
        }

        try {
            await this.verifyToken(refreshToken, token.publicKey);
            const tokenObj: PairSecretToken = await this.provideNewToken(
                {
                    name: userPayload.name,
                    id: userPayload.id,
                    email: userPayload.email,
                    role: userPayload.role,
                    session: userPayload.session,
                },
                refreshToken,
            );
            return new SuccessDto(null, HttpStatus.CREATED, tokenObj);
        } catch (e) {
            Logger.error(e.toString());
            // remove token
            await this.removeToken('session', token.session);
            throw new ForbiddenException('Token is expired');
        }
    }

    private async generateToken(payload: JwtPayload, createNew = false): Promise<PairSecretTokenType> {
        return this._CommandBus.execute(new GenerateTokenCommand(payload, createNew));
    }

    private async removeToken(by: RemoveTokenByType, value: string): Promise<boolean> {
        return this._CommandBus.execute(new RemoveTokenCommand(by, value));
    }

    private async findToken(session: string): Promise<TokenDocument> {
        return this._CommandBus.execute(new FindTokenCommand(session));
    }

    private async provideNewToken(payload: JwtInternalPayload, oldRefreshToken: string): Promise<PairSecretToken> {
        return this._CommandBus.execute(new ProvideNewTokenCommand(payload, oldRefreshToken));
    }

    private async extractToken(token: string) {
        return this._CommandBus.execute(new ExtractTokenCommand(token));
    }

    private async verifyToken(token: string, secretKey: string): Promise<JwtPayload> {
        return this._CommandBus.execute(new VerifyTokenCommand(token, secretKey));
    }
}
