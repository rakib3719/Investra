import { UserRole } from '../../../common/enums/user-role.enum';
import { AccountStatus } from '../../../common/enums/account-status.enum';

export class UserResponseDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}

export class RegistrationResponseDto {
  message: string;
  user: UserResponseDto;
  verificationToken: string;
}
