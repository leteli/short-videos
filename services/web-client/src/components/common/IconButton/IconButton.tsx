import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
import styles from "./IconButton.module.scss";
import { MouseEventHandler } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: React.FC<{ className?: string }>;
  onClick: MouseEventHandler;
  buttonClassName?: string;
  iconProps?: Record<string, unknown>;
}

export const IconButton = ({
  Icon,
  onClick,
  buttonClassName,
  iconProps,
  ...props
}: IProps) => {
  return (
    <button
      className={clsx(styles.iconBtn, buttonClassName)}
      onClick={onClick}
      {...props}
    >
      <Icon {...iconProps} />
    </button>
  );
};
