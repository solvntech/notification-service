import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@modules/user/schemas/user.schema';
import { Model } from 'mongoose';
import { SuccessDto, TError } from '@dto';
import { plainToClass } from 'class-transformer';
import { FilterUserType } from '@modules/user/types';
import { UserDto } from '@modules/user/dto/user.dto';
import { AccountDto } from '@modules/user/dto/account.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private _UserModel: Model<User>) {}

    async findAll(): Promise<SuccessDto | TError> {
        const users: UserDocument = await this._UserModel.find().lean();
        return new SuccessDto(null, HttpStatus.OK, plainToClass(UserDto, users));
    }

    async findUserBy(query: FilterUserType): Promise<UserDocument> {
        return this._UserModel.findOne(query).lean();
    }

    async create(user: AccountDto): Promise<UserDocument> {
        return this._UserModel.create(user);
    }
}
