import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notify } from '@modules/notification/schemas/notify.schema';
import { CreateNotifyDto } from '@modules/notification/dto/create-notify.dto';

@Injectable()
export class NotificationService {
    constructor(@InjectModel(Notify.name) private readonly _NotifyModel: Model<Notify>) {}

    pushNotification(createNotifyDto: CreateNotifyDto) {
        return this._NotifyModel.create(createNotifyDto);
    }
}
