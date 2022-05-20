import React from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";
import { updateAnimationOccurrences } from "../Slices/AnimationSlice";

import "./ReactiveParagraph.scss";

export const ReactiveSpan = ({
  id,
  color,
  occurrenceText,
}: {
  id: string | number;
  color: string;
  occurrenceText: string;
}) => {
  const { animatedOccurrence } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );

  const appDispatchAction = useAppDispatch();

  return (
    <span
      onDoubleClick={() => {
        appDispatchAction(updateAnimationOccurrences(id));
      }}
      style={{ backgroundColor: animatedOccurrence[id] ? color : "white" }}
    >
      {occurrenceText}
    </span>
  );
};

const ReactiveParagraph = () => {
  const { paragraph, occurrenceList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const { occurrenceHighlightColor } = useSelector(
    (store: RootStoreI) => store.filterReducer
  );

  const content = [];
  let index = 0;
  occurrenceList?.forEach((item) => {
    content.push(
      <React.Fragment key={index}>
        {paragraph.substring(index, item.startIndex)}
      </React.Fragment>
    );
    content.push(
      <ReactiveSpan
        key={item.startIndex}
        id={item.id}
        color={occurrenceHighlightColor[item.id]}
        occurrenceText={item.occurrenceText}
      />
    );
    index = item.startIndex;
    index += item.occurrenceTextLength ? item.occurrenceTextLength : 0;
  });
  content.push(paragraph.substring(index, paragraph.length));

  return <p className="report--reactive--paragraph">{content}</p>;
};

export default ReactiveParagraph;
