export enum ApiErrors {
  Unauthorized = 'UNAUTHORIZED',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidCode = 'INVALID_CODE',
  EmailAlreadyExists = 'EMAIL_ALREADY_EXISTS',
  UsernameAlreadyExists = 'USERNAME_ALREADY_EXISTS',
  UserNotFound = 'USER_NOT_FOUND',
  ChatNotFound = 'CHAT_NOT_FOUND',
  CannotAddYourselfToChat = 'CANNOT_ADD_YOURSELF_TO_CHAT',
}

export enum IValidationErrors {
  EmailRequired = 'EMAIL_REQUIRED',
  EmailNotValid = 'EMAIL_NOT_VALID',
  PasswordRequired = 'PASSWORD_REQUIRED',
  PasswordTooShort = 'PASSWORD_TOO_SHORT',
  UsernameRequired = 'USERNAME_REQUIRED',
  CodeRequired = 'CODE_EMAIL_REQUIRED',
}
