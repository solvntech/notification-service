import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { Configuration } from '@config/configuration';
import { DatabaseModule } from '@database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [Configuration.init] }),
        DatabaseModule,
        UserModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
