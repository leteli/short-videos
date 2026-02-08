export type Overwrite<T, U> = Omit<T, keyof U> & U;

export enum HandlerStatus {
  Success = 'Success',
  Failed = 'Failed',
}
