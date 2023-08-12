import { Exclude, Expose } from 'class-transformer';
import { DefaultDataDto } from '@dto';
import { UserStatus } from '@modules/user/constants/user-status';
import { UserRoles } from '@modules/user/constants/user-roles';

@Exclude()
export class UserDto extends DefaultDataDto {
    @Expose()
    email: string;

    @Expose()
    status: UserStatus;

    @Expose()
    roles: UserRoles;
}
