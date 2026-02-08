"use client";

import clsx from "clsx";
import { Controller, ControllerProps, FieldValues } from "react-hook-form";
import { Text, Variants } from "../Text/Text";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Input.module.scss";
import { useMemo } from "react";

export enum InputVariant {
  large = "large",
  small = "small",
}

interface IInputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  className?: string;
  wrapperClassName?: string;
  error?: boolean;
  errorText?: string;
  labelText?: string;
  variant?: InputVariant;
  multiline?: boolean;
  showRestCounter?: boolean;
  maxLength?: number;
  onChangeExtraHandler?: () => void;
  EndIncon?: React.FC;
  onSubmit?: () => void | Promise<void>;
}

export const Input = ({
  className,
  error,
  errorText,
  labelText,
  variant = InputVariant.large,
  multiline = false,
  showRestCounter,
  maxLength,
  wrapperClassName,
  EndIncon,
  onSubmit,
  ...props
}: IInputProps) => {
  const restCounterValue = useMemo(
    () =>
      typeof maxLength === "number"
        ? maxLength - (props.value as string)?.length
        : 0,
    [props.value, maxLength],
  );

  return (
    <div className={clsx(styles.container, styles[variant], wrapperClassName)}>
      {labelText && (
        <label htmlFor={props.name} className={styles.floatingLabel}>
          {labelText}
        </label>
      )}
      {multiline ? (
        <textarea
          className={clsx(styles.textarea, className, {
            [styles.error]: error,
          })}
          id={props.name}
          {...props}
        />
      ) : (
        <input
          className={clsx(styles.input, className, {
            [styles.error]: error,
          })}
          id={props.name}
          {...props}
        />
      )}
      {EndIncon && onSubmit && (
        <IconButton Icon={EndIncon} onClick={onSubmit} />
      )}
      {maxLength && showRestCounter && (
        <Text
          variant={Variants.caption}
          className={clsx(styles.counter, {
            [styles.couterError]: restCounterValue < 0,
          })}
        >
          {restCounterValue}
        </Text>
      )}
      {errorText && (
        <Text variant={Variants.caption} className={styles.errorText}>
          {errorText}
        </Text>
      )}
    </div>
  );
};

export type ControlledInputProps<T extends FieldValues> = {
  controllerProps: Omit<ControllerProps<T>, "render">;
  inputProps: IInputProps;
};

export const ControlledInput = <T extends FieldValues>({
  controllerProps,
  inputProps,
}: ControlledInputProps<T>) => {
  const { onChangeExtraHandler, ...restInputProps } = inputProps;
  return (
    <Controller
      {...controllerProps}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState: { errors: formErrors },
      }) => {
        const errorStatus = !!error || !!formErrors.root;
        const errorText = error?.message;
        return (
          <Input
            {...restInputProps}
            value={value}
            onChange={(e) => {
              onChange(e);
              if (onChangeExtraHandler) {
                onChangeExtraHandler();
              }
            }}
            error={errorStatus}
            errorText={errorText}
          />
        );
      }}
    />
  );
};
