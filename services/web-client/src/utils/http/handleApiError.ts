import { AxiosError, isAxiosError } from "axios";

const COMMON_ERROR_TEXT = 'Something went wrong. Try again';

interface IApiError {
  statusCode: number;
  message: string;
}

export interface IHandledError {
  message: string;
}

export const parseAxiosError = ({ response }: AxiosError<IApiError>) => {
  return response ? response.data.message : COMMON_ERROR_TEXT;
}

export const  getAxiosErrorMessage = (err: unknown) => {
  if(!isAxiosError(err)) {
    return (err instanceof Error) ? err.message : COMMON_ERROR_TEXT;
  }
  return parseAxiosError(err);
};

export const getAxiosErrorStatusCode = (err: unknown): number | undefined => {
  if (isAxiosError(err)) {
    return err.response?.data.statusCode;
  }
};
