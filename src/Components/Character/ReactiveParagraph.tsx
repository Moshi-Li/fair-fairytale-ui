import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { EventI, TextOccurrenceI } from "../../Slices/DataSlice";
import { RootStoreI } from "../../Store";

const generateContent = (
  eventListInput: EventI[],
  paragraph: string,
  gender: string,
  selectedEventVerbStart: number | null,
  setSelectedEventVerbStart: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const eventList: EventI[] = JSON.parse(JSON.stringify(eventListInput));

  const textOccurrenceMap: Record<string | number, TextOccurrenceI> = {};
  eventList.forEach((eventItem) => {
    const {
      event,
      verbStartByteText,
      verbEndByteText,
      argument,
      argText,
      argStartByteText,
      argEndByteText,
      gender,
    } = eventItem;
    if (!textOccurrenceMap[verbStartByteText]) {
      textOccurrenceMap[verbStartByteText] = {
        type: "verb",
        occurrenceText: event,
        textStartIndex: verbStartByteText,
        textEndIndex: verbEndByteText,
        textLength: event.length,
        associatedStartIndex: [],
      };
    }
    textOccurrenceMap[argStartByteText] = {
      type: argument,
      occurrenceText: argText,
      textStartIndex: argStartByteText,
      textEndIndex: argEndByteText,
      textLength: argText.length,
      associatedStartIndex: [verbStartByteText],
    };

    textOccurrenceMap[verbStartByteText].associatedStartIndex.push(
      argStartByteText
    );
    textOccurrenceMap[verbStartByteText].associatedStartIndex.sort(
      (a, b) => a - b
    );
  });

  const textTextOccurrenceList: TextOccurrenceI[] = [];
  Object.keys(textOccurrenceMap).map((key) => {
    textTextOccurrenceList.push(textOccurrenceMap[key]);
  });
  textTextOccurrenceList.sort((a, b) => a.textStartIndex - b.textStartIndex);

  const result = [];
  let index = 0;

  textTextOccurrenceList.forEach((textOccurrence) => {
    result.push(
      <React.Fragment key={index}>
        {paragraph.substring(index, textOccurrence.textStartIndex)}
      </React.Fragment>
    );
    if (textOccurrence.type === "verb") {
      result.push(
        <span
          key={textOccurrence.textStartIndex}
          className={`text--occurrence__${gender}__primary${
            selectedEventVerbStart === textOccurrence.textStartIndex
              ? "__selected"
              : ""
          }`}
          onClick={(e) => {
            setSelectedEventVerbStart(textOccurrence.textStartIndex);
          }}
        >
          {paragraph.substring(
            textOccurrence.textStartIndex,
            textOccurrence.textEndIndex
          )}
        </span>
      );
    } else {
      result.push(
        <span
          key={textOccurrence.textStartIndex}
          className={`${
            selectedEventVerbStart !== null &&
            textOccurrence.associatedStartIndex.includes(selectedEventVerbStart)
              ? `text--occurrence__${gender}__secondary`
              : ""
          }`}
        >
          {paragraph.substring(
            textOccurrence.textStartIndex,
            textOccurrence.textEndIndex
          )}
        </span>
      );
    }
    index = textOccurrence.textEndIndex;
  });

  result.push(
    <React.Fragment key={index}>
      {paragraph.substring(index, paragraph.length)}
    </React.Fragment>
  );

  return result;
};

const ReactiveParagraph = ({
  eventList,
  gender,
  selectedEventVerbStart,
  setSelectedEventVerbStart,
}: {
  eventList: EventI[];
  gender: string;
  selectedEventVerbStart: number | null;
  setSelectedEventVerbStart: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}) => {
  const { paragraph } = useSelector((store: RootStoreI) => store.dataReducer);

  const memoizedContent = useMemo(() => {
    return generateContent(
      eventList,
      paragraph,
      gender,
      selectedEventVerbStart,
      setSelectedEventVerbStart
    );
  }, [
    eventList,
    paragraph,
    gender,
    selectedEventVerbStart,
    setSelectedEventVerbStart,
  ]);

  return (
    <React.Fragment>
      <p className="report--reactive--paragraph">{memoizedContent}</p>
    </React.Fragment>
  );
};

export default ReactiveParagraph;
