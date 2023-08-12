import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { JwtPayload, PairSecretTokenType } from '@modules/token/types';
import { TokenService } from '@modules/token/token.service';

export class GenerateTokenCommand implements ICommand {
    constructor(public readonly payload: JwtPayload, public readonly createNew = false) {}
}

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateTokenCommand, PairSecretTokenType> {
    constructor(private _TokenService: TokenService) {}

    execute(command: GenerateTokenCommand): Promise<PairSecretTokenType> {
        return this._TokenService.generateToken(command.payload, command.createNew);
    }
}
