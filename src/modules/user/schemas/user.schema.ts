import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from '@modules/user/constants/user-status';
import { UserRoles } from '@modules/user/constants/user-roles';

const COLLECTION_NAME = 'users';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class User {
    @Prop({ maxlength: 150, trim: true })
    name: string;

    @Prop({ unique: true, required: true, trim: true })
    email: string;

    @Prop({ required: true, minlength: 8 })
    password: string;

    @Prop({ enum: UserStatus, default: UserStatus.IN_ACTIVE })
    status: UserStatus;

    @Prop({ type: Boolean, default: false })
    verify: boolean;

    @Prop({ default: UserRoles.USER })
    role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
