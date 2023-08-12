import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { JwtInternalPayload } from '@modules/token/types';
import { TokenService } from '@modules/token/token.service';

export class ExtractTokenCommand implements ICommand {
    constructor(public readonly token: string) {}
}

@CommandHandler(ExtractTokenCommand)
export class ExtractTokenHandler implements ICommandHandler<ExtractTokenCommand, JwtInternalPayload> {
    constructor(private _TokenService: TokenService) {}

    async execute(command: ExtractTokenCommand): Promise<JwtInternalPayload> {
        return this._TokenService.extractToken(command.token);
    }
}
