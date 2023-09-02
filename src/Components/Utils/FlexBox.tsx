import React from "react";
import "./FlexBox.scss";

export function FlexBox({
  children,
  ...props
}: {
  children?: React.ReactNode;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className="flex--section" {...props}>
      {children}
    </div>
  );
}

export function FlexItem({
  children,
  ...props
}: {
  children?: React.ReactNode;
  props?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className="flex--section--item" {...props}>
      {children}
    </div>
  );
}
