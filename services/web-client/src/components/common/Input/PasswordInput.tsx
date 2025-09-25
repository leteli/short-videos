import {
  Control,
  UseFormSetValue,
  Path,
  PathValue,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";
import { ControlledInput, InputVariant } from "./Input";

export enum PasswordPurpose {
  Login = "login",
  Signup = "signup",
  Confirm = "confirm"
}

type ComponentProps<T extends FieldValues> = {
  name: Path<T>;
  className?: string;
  control: Control<T>;
  setValue: UseFormSetValue<T>,
  purpose?: PasswordPurpose;
  variant?: InputVariant;
  watch?: UseFormWatch<T>;
  compareWithField?: Path<T>;
  onChangeExtraHandler?: () => void;
};

const PASSWORD_LENGTH_MIN = 6;

export const PasswordInput = <T extends FieldValues>({
  control,
  setValue,
  className,
  name,
  variant = InputVariant.large,
  purpose = PasswordPurpose.Login,
  watch,
  onChangeExtraHandler,
  compareWithField,
}:
ComponentProps<T>) => {
  const actionText = purpose === PasswordPurpose.Confirm ? "Confirm" : "Enter";
  return (
    <ControlledInput<T>
      inputProps={{
        type: "password",
        labelText: purpose === PasswordPurpose.Confirm ? "Confirm password" : "Password",
        className,
        variant,
        onChangeExtraHandler,
      }}
      controllerProps={{
        name,
        control,
        rules: {
          required: `${actionText} password`,
          ...(purpose === PasswordPurpose.Signup && { minLength: { value: PASSWORD_LENGTH_MIN,  message: "Password must be longer than 6 characters" } }),
          validate: async (value) => {
            const trimmedValue = value.trim();
            if (!trimmedValue.length) {
              setValue(name, "" as PathValue<T, typeof name>);
              return `${actionText} password`;
            }
            if (purpose === PasswordPurpose.Confirm && compareWithField && watch?.(compareWithField) !== value) {
              return 'Passwords do not match';
            }
            return true;
          },
        },
      }}
    />
  );
};
