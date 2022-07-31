import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";
import { updateAnimationOccurrences } from "../Slices/AnimationSlice";

import "./ReactiveParagraph.scss";

const ReactiveParagraph = () => {
  const { paragraph, textOccurrenceMap } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const content = [];
  let leftBound = 0;
  let rightBound = 0;
  while (rightBound < paragraph.length) {
    if (textOccurrenceMap[rightBound]) {
      console.log(textOccurrenceMap[rightBound]);
      content.push(
        <React.Fragment key={leftBound}>
          {paragraph.substring(leftBound, rightBound)}
        </React.Fragment>
      );
      leftBound = rightBound;
      rightBound = textOccurrenceMap[rightBound].textEndIndex;
      content.push(
        <span style={{ color: "red" }} key={leftBound}>
          {paragraph.substring(leftBound, rightBound)}
        </span>
      );
    } else {
      rightBound++;
    }
  }

  return (
    <React.Fragment>
      <p className="report--reactive--paragraph">{content}</p>
    </React.Fragment>
  );
};

export default ReactiveParagraph;
