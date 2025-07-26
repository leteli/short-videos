import { ReactNode, createElement } from "react";
import clsx from "clsx";
import styles from "./Text.module.scss";

export enum Tags {
  h1 = "h1",
  h2 = "h2",
  p = "p",
  span = "span",
}

export enum Variants {
  h1 = "h1",
  h2 = "h2",
  title = "title",
  lgText = "lgText",
  text = "text",
  caption = "caption",
}

interface IProps {
  tag?: Tags;
  variant?: Variants;
  className?: string;
  children: ReactNode;
}

export const Text = ({
  variant = Variants.text,
  tag = Tags.span,
  className,
  children,
}: IProps) => {
  return createElement(
    tag,
    { className: clsx([styles.basicText, styles[variant], className]) },
    children
  );
};
