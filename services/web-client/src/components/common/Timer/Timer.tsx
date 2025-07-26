import React from "react";
import { useTimer } from "react-timer-hook";
import styles from "./Timer.module.scss";
import clsx from "clsx";

interface ICounterProps {
  hours?: number;
  minutes: number;
  seconds: number;
  className?: string;
}

export const Counter = ({
  hours,
  minutes,
  seconds,
  className,
}: ICounterProps) => {
  return (
    <span className={clsx(styles.container, className)}>
      {hours ? `${String(hours).padStart(2, "0")}:` : ""}
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
};

interface IProps {
  onExpire?: () => void;
  expiryTimestamp: Date;
  autoStart?: boolean;
  className?: string;
}

export const Timer: React.FC<IProps> = ({
  onExpire,
  expiryTimestamp,
  autoStart,
  className,
}) => {
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire,
    autoStart,
  });
  return <Counter minutes={minutes} seconds={seconds} className={className} />;
};
