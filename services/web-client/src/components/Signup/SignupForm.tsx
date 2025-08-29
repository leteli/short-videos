"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useUnit } from "effector-react";
import { useForm, useWatch } from "react-hook-form";
import { useBool } from "@/hooks/useBool";
import { useDebounce } from "@/hooks/useDebounce";
import { Text, Variants, Tags } from "../common/Text/Text";
import { ControlledInput, InputVariant } from "../common/Input/Input";
import { PasswordInput, PasswordPurpose } from "../common/Input/PasswordInput";
import { Button, ButtonSize, ButtonVariant } from "../common/Button/Button";

import { signUpFx, confirmSignupFx } from "@/stores";
import { CHATS_ROUTE } from "@/constants/clientRoutes";
import { ConfirmCodeForm } from "../ConfirmCodeForm/ConfirmCodeForm";

import { getAxiosErrorMessage } from "@/utils/http/handleApiError";
import { ApiErrors } from "@/constants/errors";
import { handleVerifyUsername } from "@/stores/users/handlers/handleVerifyUsername";
import { USERNAME_MIN } from "@/constants/common";

import styles from "./Signup.module.scss";

interface ISignupFormValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface ICodeFormValues {
  code: string;
}

const DEFAULT_VALUES = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export const CONFIRM_CODE_LENGTH = 6;

export const SignupForm = () => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    trigger,
    formState,
    setError,
    clearErrors,
  } = useForm<ISignupFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const email = useWatch({
    control,
    name: "email",
  });
  const username = useWatch({
    control,
    name: "username",
  });

  useDebounce(
    async () => {
      try {
        clearErrors("username");
        if (username.length <= USERNAME_MIN) {
          return;
        }
        await handleVerifyUsername({ username });
      } catch (err) {
        if (getAxiosErrorMessage(err) === ApiErrors.UsernameAlreadyExists) {
          setError("username", {
            message: `Username ${username} is already taken`,
          });
        }
      }
    },
    300,
    [username]
  );

  const { signUp, signUpPending, confirmSignup } = useUnit({
    signUp: signUpFx,
    signUpPending: signUpFx.pending,
    confirmSignup: confirmSignupFx,
  });

  const codeView = useBool(false);
  const [resendDate, setResendDate] = useState<Date | null>(null);
  const canResendCode = useBool(false);

  const handleSignup = async ({
    username,
    email,
    password,
  }: ISignupFormValues) => {
    try {
      setResendDate(null);
      canResendCode.onFalse();
      const result = await signUp({ username, email, password });
      codeView.onTrue();
      setResendDate(new Date(result.expiresAt));
    } catch (err: unknown) {
      if (getAxiosErrorMessage(err) === ApiErrors.EmailAlreadyExists) {
        setError("email", { message: `Email ${email} is already in use` });
      }
    }
  };

  const router = useRouter();

  const handleConfirmSignup = useCallback(
    async (data: ICodeFormValues) => {
      await confirmSignup({ ...data, email });
      router.push(CHATS_ROUTE);
    },
    [confirmSignup, router, email]
  );

  const onResendCode = () => {
    handleSubmit(handleSignup)();
  };

  if (codeView.value) {
    return (
      <ConfirmCodeForm
        codeLength={CONFIRM_CODE_LENGTH}
        handleCodeSubmit={handleConfirmSignup}
        email={email}
        resendDate={resendDate}
        canResendCode={canResendCode}
        onResendCode={onResendCode}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(handleSignup)} className={styles.form}>
      <Text variant={Variants.h1} tag={Tags.h1}>
        Sign up
      </Text>
      <ControlledInput<ISignupFormValues>
        inputProps={{
          type: "text",
          labelText: "Email",
          variant: InputVariant.large,
        }}
        controllerProps={{
          name: "email",
          control,
          rules: {
            required: "Enter email",
            validate: (value) => {
              const trimmedValue = value.trim();
              if (!trimmedValue.length) {
                setValue("email", "");
                return "Enter email";
              }
              return true;
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email is invalid",
            },
          },
        }}
      />
      <ControlledInput<ISignupFormValues>
        inputProps={{
          type: "text",
          labelText: "Username",
          variant: InputVariant.large,
        }}
        controllerProps={{
          name: "username",
          control,
          rules: { required: "Enter username" },
        }}
      />
      <PasswordInput<ISignupFormValues>
        control={control}
        setValue={setValue}
        name="password"
        purpose={PasswordPurpose.Signup}
        watch={watch}
        onChangeExtraHandler={() => {
          if (formState.isSubmitted) {
            trigger("confirmPassword");
          }
        }}
      />
      <PasswordInput<ISignupFormValues>
        control={control}
        setValue={setValue}
        name="confirmPassword"
        purpose={PasswordPurpose.Confirm}
        watch={watch}
        compareWithField="password"
      />
      <Button
        type="submit"
        text="Sign up"
        variant={ButtonVariant.primary}
        size={ButtonSize.large}
        disabled={Object.keys(formState.errors).length > 0 || signUpPending}
        processing={signUpPending}
      />
    </form>
  );
};
