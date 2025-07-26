import { useForm, useWatch } from "react-hook-form";
import styles from "./ConfirmCodeForm.module.scss";

import { ControlledInput } from "../common/Input/Input";
import { Tags, Text, Variants } from "../common/Text/Text";
import { useEffect } from "react";
import { InputVariant } from "../common/Input/Input";
import { Timer } from "../common/Timer/Timer";
import { IUseBool } from "../hooks/useBool";
import { getAxiosErrorMessage } from "@/utils/http/handleApiError";
import { ApiErrors } from "@/constants/errors";

interface ICodeFormValues {
  code: string;
}

interface IProps {
  codeLength: number;
  email: string;
  handleCodeSubmit: (data: ICodeFormValues) => void;
  resendDate: Date | null;
  canResendCode: IUseBool;
  onResendCode: () => void;
}

export const ConfirmCodeForm = ({
  codeLength,
  handleCodeSubmit,
  email,
  resendDate,
  canResendCode,
  onResendCode,
}: IProps) => {
  const {
    control,
    setError,
  } = useForm<ICodeFormValues>({
    defaultValues: { code: "" },
  });

  const code = useWatch({
    control,
    name: "code",
  });

  useEffect(() => {
    const onCodeSubmit = async () => {
      try {
        await handleCodeSubmit({ code });
      } catch (err) {
        if (getAxiosErrorMessage(err) === ApiErrors.InvalidCode) {
          setError("code", { message: `The code is invalid` });
        }
      }
    };
    if (code.length === codeLength) {
      onCodeSubmit();
    }
  }, [code.length]);

  return (
    <form className={styles.container}>
      <div className={styles.texts}>
        <Text variant={Variants.h2} tag={Tags.h2}>
          Enter confirmation code
        </Text>
        <Text className={styles.caption}>The code was sent to {email}</Text>
      </div>
      <ControlledInput
        controllerProps={{
          name: "code",
          control,
        }}
        inputProps={{
          type: "text",
          variant: InputVariant.small,
          className: styles.input,
        }}
      />
      {resendDate && !canResendCode.value && (
        <span className={styles.timerLabel}>
          Your Code will expire in{" "}
          <Timer
            expiryTimestamp={resendDate}
            onExpire={canResendCode.onTrue}
            className={styles.timer}
          />
        </span>
      )}
      {canResendCode.value && (
        <span onClick={onResendCode} className={styles.resendLabel}>
          Resend code
        </span>
      )}
    </form>
  );
};
