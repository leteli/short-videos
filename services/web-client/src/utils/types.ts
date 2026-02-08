export interface Option {
  label: string;
  value: string;
}

export type socketHandlerType = <T = unknown[]>(args: T) => void;
