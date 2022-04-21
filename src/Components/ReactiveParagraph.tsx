import React, { Dispatch, SetStateAction } from "react";
import { OccurrenceI } from "../MockData";

const ReactiveSpan = ({
  id,
  type,
  occurrenceText,
  animatedOccurrenceId,
}: {
  id: string | number;
  type: string;
  occurrenceText: string;
  animatedOccurrenceId: Record<string | number, boolean | undefined>;
}) => (
  <span className={`${animatedOccurrenceId[id] ? "person" : ""}`}>
    {occurrenceText}
  </span>
);

const ReactiveParagraph = ({
  occurrenceList,
  paragraph,
  animatedOccurrenceId,
}: {
  paragraph: string;
  occurrenceList: OccurrenceI[];
  animatedOccurrenceId: Record<string | number, boolean | undefined>;
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
        animatedOccurrenceId={animatedOccurrenceId}
      />
    );
    index = item.startIndex;
    index += item.occurrenceTextLength ? item.occurrenceTextLength : 0;
  });
  content.push(paragraph.substring(index, paragraph.length));

  return <p className="paragraph--reactive">{content}</p>;
};

export default ReactiveParagraph;
