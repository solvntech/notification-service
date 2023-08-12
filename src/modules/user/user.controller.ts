import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { Auth } from '@modules/auth/decorators';
import { UserRoles } from '@modules/user/constants/user-roles';

@Controller('users')
@Auth(UserRoles.ADMIN)
export class UserController {
    constructor(private _UserService: UserService) {}

    @Get('list')
    findAll() {
        return this._UserService.findAll();
    }
}
