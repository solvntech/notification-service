import { FilterQueryType } from '@types';
import { UserDocument } from '@modules/user/schemas/user.schema';

export type FilterUserType = FilterQueryType<UserDocument>;
