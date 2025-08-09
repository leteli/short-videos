"use client";

import { useForm, Control, FieldValues } from "react-hook-form";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUnit } from "effector-react";
import { loginFx } from "@/stores";
import { Text, Variants, Tags } from "../common/Text/Text";
import { ControlledInput, InputVariant } from "../common/Input/Input";
import { PasswordInput } from "../common/Input/PasswordInput";
import { Button, ButtonSize, ButtonVariant } from "../common/Button/Button";
import styles from "./Login.module.scss";
import { getAxiosErrorMessage } from "@/utils/http/handleApiError";
import { ApiErrors } from "@/constants/errors";
import { CHATS_ROUTE } from "@/constants/clientRoutes";

interface ILoginFormValues {
  username: string;
  password: string;
}

const DEFAULT_VALUES = {
  username: "",
  password: "",
};

export const LoginForm = () => {
  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<ILoginFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const { login, loginPending } = useUnit({
    login: loginFx,
    loginPending: loginFx.pending,
  });

  const router = useRouter();

  const handleLogin = useCallback(
    async (data: ILoginFormValues) => {
      try {
        await login(data);
        router.push(CHATS_ROUTE);
      } catch (error) {
        if (getAxiosErrorMessage(error) === ApiErrors.InvalidCredentials) {
          setError("root", { message: "Invalid username or password." });
        }
      }
    },
    [login, setError]
  );

  const rootErrorHandler = useCallback(() => {
    if (errors.root) {
      clearErrors("root");
    }
  }, [errors, clearErrors]);

  return (
    <form onSubmit={handleSubmit(handleLogin)} className={styles.form}>
      <Text tag={Tags.h1} variant={Variants.h1}>
        Sign in
      </Text>
      <div className={styles.wrapper}>
        <div className={styles.inputsBlock}>
          <ControlledInput
            inputProps={{
              type: "text",
              labelText: "Username",
              className: styles.input,
              variant: InputVariant.large,
              onChangeExtraHandler: rootErrorHandler,
            }}
            controllerProps={{
              name: "username",
              control: control as unknown as Control<
                FieldValues,
                ILoginFormValues
              >,
              rules: { required: "Enter username" },
            }}
          />
          <PasswordInput<ILoginFormValues>
            name="password"
            setValue={setValue}
            control={control}
            className={styles.input}
            onChangeExtraHandler={rootErrorHandler}
          />
        </div>
        {errors.root && (
          <Text variant={Variants.caption} className={styles.errorText}>
            {errors.root.message}
          </Text>
        )}
      </div>
      <Button
        type="submit"
        text="Sign in"
        size={ButtonSize.large}
        variant={ButtonVariant.primary}
        disabled={loginPending || Object.keys(errors).length > 0}
      />
    </form>
  );
};
