import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { NotifyType } from '@modules/notification/constants/notify-type';

@Exclude()
export class CreateNotifyDto {
    @Expose()
    @IsString()
    content: string;

    @Expose()
    @IsMongoId()
    senderId: mongoose.Types.ObjectId;

    @Expose()
    @IsMongoId()
    receiverId: mongoose.Types.ObjectId;

    @Expose()
    @IsNotEmpty()
    @IsEnum(NotifyType, { message: 'type is invalid value' })
    type: NotifyType;
}
