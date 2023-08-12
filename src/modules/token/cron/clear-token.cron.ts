import { TokenService } from '../token.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClearTokenCron {
    constructor(private readonly _TokenService: TokenService) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async clearTokenDaily() {
        Logger.log('Clear Token');
        await this._TokenService.clearTokens();
    }
}
