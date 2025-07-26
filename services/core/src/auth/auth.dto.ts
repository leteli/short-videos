import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IValidationErrors } from 'src/common/constants/errors.constants';
import { PASSWORD_LENGTH_MIN } from 'src/common/constants/app.constants';

export class SignupDto {
  @IsNotEmpty({ message: IValidationErrors.EmailRequired })
  @IsEmail({}, { message: IValidationErrors.EmailNotValid })
  email: string;

  @IsNotEmpty({ message: IValidationErrors.UsernameRequired })
  username: string;

  @IsNotEmpty({ message: IValidationErrors.PasswordRequired })
  @MinLength(PASSWORD_LENGTH_MIN, {
    message: IValidationErrors.PasswordTooShort,
  })
  password: string;
}

export class ConfirmSignupDto {
  @IsNotEmpty({ message: IValidationErrors.CodeRequired })
  code: string;

  @IsNotEmpty({ message: IValidationErrors.EmailRequired })
  @IsEmail({}, { message: IValidationErrors.EmailNotValid })
  email: string;
}
