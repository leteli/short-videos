import { codeExpiresInMin } from 'src/registrationRequest/registrationRequest.model';

const REGISTRATION_EMAIL_CONTENT = {
  SUBJECT: `Your Registration Code for Short Videos Chat`,
  GET_TEXT: (username: string, code: string) =>
    `Hi, ${username}!\n\nThanks for signing up for our chat. Here’s your confirmation code:\n${code}\n\nThis code is valid for the next ${codeExpiresInMin} minutes. Please don’t share it with anyone.\n\nCheers,\nNastia`,
};

export enum EmailTypes {
  registration = 'registration',
  passwordReset = 'passwordReset',
}

interface IRegistrationParams {
  username: string;
  code: string;
}

interface IEmailContentParams {
  type: EmailTypes;
  registrationParams?: IRegistrationParams;
}

export const getEmailContent = ({
  type,
  registrationParams,
}: IEmailContentParams) => {
  if (type === EmailTypes.registration && registrationParams) {
    return {
      subject: REGISTRATION_EMAIL_CONTENT.SUBJECT,
      text: REGISTRATION_EMAIL_CONTENT.GET_TEXT(
        registrationParams.username,
        registrationParams.code,
      ),
    };
  }
};
