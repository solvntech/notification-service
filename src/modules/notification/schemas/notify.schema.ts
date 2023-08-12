import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotifyType } from '@modules/notification/constants/notify-type';
import mongoose from 'mongoose';

const COLLECTION_NAME = 'notifies';

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Notify {
    @Prop()
    content: string;

    @Prop({ enum: NotifyType })
    type: NotifyType;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    senderId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    receiverId: mongoose.Types.ObjectId;
}

export const NotifySchema = SchemaFactory.createForClass(Notify);
