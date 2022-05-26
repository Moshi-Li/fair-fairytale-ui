import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { RootStoreI, useAppDispatch } from "../Store";
import { updateAnimationOccurrences } from "../Slices/AnimationSlice";

import "./ReactiveParagraph.scss";

export const DataDisplay = () => {
  const { occurrenceMap } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const { animatedOccurrence } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );
  const { occurrenceHighlightColor } = useSelector(
    (store: RootStoreI) => store.filterReducer
  );

  const selectedCharacter = useMemo(() => {
    return Object.keys(animatedOccurrence).filter((id) => {
      return occurrenceMap[id].type === "character" ? true : false;
    });
  }, [occurrenceMap, animatedOccurrence]);
  const selectedEvent = useMemo(() => {
    return Object.keys(animatedOccurrence).filter((id) => {
      return occurrenceMap[id].type === "event" ? true : false;
    });
  }, [occurrenceMap, animatedOccurrence]);

  return (
    <div className="data-display">
      {[
        selectedCharacter.length ? <p>{`Character: `}</p> : "",
        ...selectedCharacter.map((id) => {
          return (
            <ReactiveSpan
              id={id}
              color={occurrenceHighlightColor[id]}
              occurrenceText={occurrenceMap[id].occurrenceText}
            ></ReactiveSpan>
          );
        }),
        selectedEvent.length ? <p>{`Event: `}</p> : "",
        ...selectedEvent.map((id) => {
          return (
            <ReactiveSpan
              id={id}
              color={occurrenceHighlightColor[id]}
              occurrenceText={occurrenceMap[id].occurrenceText}
            ></ReactiveSpan>
          );
        }),
      ].flat()}
    </div>
  );
};

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
  const { occurrenceMap } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const appDispatchAction = useAppDispatch();

  return (
    <span
      className="reactive-span"
      onDoubleClick={() => {
        appDispatchAction(updateAnimationOccurrences(id));
      }}
      style={{
        backgroundColor:
          animatedOccurrence[id] && occurrenceMap[id].type === "character"
            ? color
            : "white",
        color: animatedOccurrence[id]
          ? occurrenceMap[id].type === "character"
            ? "white"
            : color
          : "black",

        fontWeight: animatedOccurrence[id] ? "bold" : "normal",
        border:
          animatedOccurrence[id] && occurrenceMap[id].type === "event"
            ? `2px solid ${color}`
            : "1px solid black",
      }}
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

  return (
    <React.Fragment>
      <p className="report--reactive--paragraph">{content}</p>
      <DataDisplay></DataDisplay>
    </React.Fragment>
  );
};

export default ReactiveParagraph;
