import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../token/guards/jwt.guard';
import { PERMISSION_KEY, UserRoles } from '@modules/user/constants/user-roles';

export const Auth = (...roles: UserRoles[]) => applyDecorators(SetMetadata(PERMISSION_KEY, roles), UseGuards(JwtGuard));
