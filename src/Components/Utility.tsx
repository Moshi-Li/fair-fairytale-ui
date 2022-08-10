import React from "react";
import { AiOutlineUpCircle } from "react-icons/ai";
import "./Utility.scss";

export const ReportSectionLabel = ({ text }: { text: string }) => (
  <label className="report--label">{text}</label>
);

export const ReportDivider = () => <div className="report--divider"></div>;

export const ReportBackToTop = () => {
  return (
    <AiOutlineUpCircle
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className="report--back--btn"
    ></AiOutlineUpCircle>
  );
};

export const VerticalDivider = () => <div className="vertical--divider"></div>;

export const COLOR_BLUE = "#8AC7FF";
export const COLOR_RED = "#FC8E94";
export const COLOR_GRAY = "#A7A7A7";

const Components = { ReportSectionLabel, ReportDivider };
export default Components;
