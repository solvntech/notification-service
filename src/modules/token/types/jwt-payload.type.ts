import { UserRoles } from '@modules/user/constants/user-roles';

export type JwtPayload = {
    name: string;
    id: string;
    role: UserRoles;
    email: string;
};

export type JwtInternalPayload = JwtPayload & {
    session: string;
};
