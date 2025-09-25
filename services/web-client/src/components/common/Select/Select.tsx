"use client";
import { Controller, ControllerProps, FieldValues } from "react-hook-form";
import SelectComponent, { Props } from "react-select";

import styles from "./Select.module.scss";

export interface Option {
  label: string;
  value: string;
}
interface ISelectProps extends Props {
  labelText: string;
  withError?: boolean;
}

export const Select = ({ labelText, ...props }: ISelectProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.floatingLabel} htmlFor={labelText}>
        {labelText}
      </label>
      <SelectComponent
        id={labelText}
        options={props.options}
        isSearchable={true}
        isClearable={true}
        blurInputOnSelect={true}
        {...props}
        styles={{
          control: (base) => ({
            ...base,
            border: `0.1875rem solid var(--border-primary) !important`,
            ...(props.withError && {
              border: "0.1875rem solid var(--destructive) !important",
            }),
            boxShadow: "none",
            outline: "none",
            borderRadius: "6.25rem",
            height: "3.5rem",
            minHeight: "3.5rem",
            backgroundColor: "var(--white-03)",
            alignSelf: "stretch",
          }),
          input: (base) => ({
            ...base,
            padding: "0.5rem 0.75rem",
            color: "var(--text-primary)",
          }),
          indicatorSeparator: () => ({ display: "none" }),
          placeholder: (base) => {
            if (!props.placeholder) {
              return { display: "none" };
            }
            return { ...base, paddingLeft: "0.75rem" };
          },
          singleValue: (base) => ({
            ...base,
            color: "var(--text-secondary)",
            padding: "0 0.625rem",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 10,
            marginTop: "0.25rem",
            borderRadius: "1.75rem",
            background: "var(--surface-primary)",
            border: "0.1875rem solid var(--border-primary)",
            overflow: "hidden",
            color: "var(--text-secondary)",
          }),
          menuList: (base) => ({
            ...base,
            padding: 0,
            background: "var(--white-03)",
            "::-webkit-scrollbar": {
              width: "0.5rem",
            },
            "::-webkit-scrollbar-track": {
              background: "transparent",
              margin: '1rem 0',
              borderRadius: "0.75rem",
              height: "80%",
            },
            "::-webkit-scrollbar-thumb": {
              borderRadius: "100px",
              background: "var(--border-accent)",
              border: "0.175rem solid rgba(0, 0, 0, 0)",
              backgroundClip: "padding-box",
            },
            "::-webkit-scrollbar-button": {
              display: "none",
              width: 0,
              height: 0,
            }
          }),
          option: (base) => ({
            ...base,
            height: "auto",
            padding: "0.6875rem 1.125rem",
            background: "transparent",
            cursor: "pointer",
            overflow: "hidden",
            wordWrap: "break-word",
            "&:hover": {
              background: "var(--white-03)",
            },
            "&:active": {
              background: "inherit",
            },
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "var(--text-primary)",
            cursor: "pointer",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            ...(props.isMulti && { alignItems: "flex-start" }),
          }),
        }}
      />
    </div>
);
};

export interface ControlledSelectProps<T extends FieldValues> {
  controllerProps: Omit<ControllerProps<T>, "render">;
  selectProps: ISelectProps;
}

export const ControlledSelect = <T extends FieldValues>({
  controllerProps,
  selectProps,
}: ControlledSelectProps<T>) => {
  return (
    <Controller
      {...controllerProps}
      render={({ field: { onChange, value } }) => {
        return (
          <Select
            {...selectProps}
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
};
