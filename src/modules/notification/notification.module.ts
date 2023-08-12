import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notify, NotifySchema } from '@modules/notification/schemas/notify.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Notify.name,
                schema: NotifySchema,
            },
        ]),
    ],
    providers: [NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule {}
