import React from "react";
import "./Utility.scss";

export const ReportSectionLabel = ({ text }: { text: string }) => (
  <label className="report--label">{text}</label>
);

export const ReportDivider = () => <div className="report--divider"></div>;

const Components = { ReportSectionLabel, ReportDivider };
export default Components;
