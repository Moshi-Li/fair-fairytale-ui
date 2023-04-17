import React, { useRef, useState } from "react";
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

export const ScrollDownBtn = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(true);

  const btnClick = () => {
    scrollTarget.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    setShowScrollBtn(false);
  };

  /*
  useEffect(() => {
    const pointer = setTimeout(() => {
      setShowScrollBtn(false);
    }, 10 * 1000);
    return () => clearTimeout(pointer);
  }, []);*/

  return (
    <React.Fragment>
      {showScrollBtn && (
        <div className="scroll--down--btn" onClick={btnClick}>
          <div className="chevron" onClick={btnClick}></div>
          <div className="chevron" onClick={btnClick}></div>
          <div className="chevron" onClick={btnClick}></div>
        </div>
      )}
      <div className="scroll--down--target" ref={scrollTarget}></div>
    </React.Fragment>
  );
};

export const COLOR_BLUE = "#8AC7FF";
export const COLOR_RED = "#FC8E94";
export const COLOR_GRAY = "#A7A7A7";

const Components = { ReportSectionLabel, ReportDivider };
export default Components;
