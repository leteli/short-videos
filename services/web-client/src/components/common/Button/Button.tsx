import clsx from "clsx";
import { Loader } from "../Loader/Loader";
import styles from "./Button.module.scss";

export enum ButtonSize {
  large = "large",
  small = "small",
}

export enum ButtonVariant {
  primary = "primary",
  accent = "accent",
  secondary = "secondary",
}

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text: string;
  size?: ButtonSize;
  variant: ButtonVariant;
  processing?: boolean;
}
export const Button = ({
  className,
  size,
  variant,
  text,
  processing = false,
  ...props
}: IButtonProps) => {
  return (
    <button
      className={clsx(styles.button, size && styles[size], styles[variant], className)}
      {...props}
    >
      {processing ? <Loader /> : text}
    </button>
  );
};
