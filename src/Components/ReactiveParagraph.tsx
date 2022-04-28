import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { OccurrenceI } from "../MockData";
import { RootStoreI } from "../Store";
import { updateAnimationOccurrences } from "../Slices/AnimationSlice";

const ReactiveSpan = ({
  id,
  type,
  occurrenceText,
}: {
  id: string | number;
  type: string;
  occurrenceText: string;
}) => {
  const { animatedOccurrence } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );
  const dispatchAction = useDispatch();
  return (
    <span
      onDoubleClick={() => dispatchAction(updateAnimationOccurrences(id))}
      className={`${animatedOccurrence[id] ? "person" : ""}`}
    >
      {occurrenceText}
    </span>
  );
};

const ReactiveParagraph = ({
  occurrenceList,
  paragraph,
}: {
  paragraph: string;
  occurrenceList: OccurrenceI[];
}) => {
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
        type={item.type}
        occurrenceText={item.occurrenceText}
      />
    );
    index = item.startIndex;
    index += item.occurrenceTextLength ? item.occurrenceTextLength : 0;
  });
  content.push(paragraph.substring(index, paragraph.length));

  return <p className="paragraph--reactive">{content}</p>;
};

export default ReactiveParagraph;
