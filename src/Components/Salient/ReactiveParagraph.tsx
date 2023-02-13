import React, { useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EventI, TextOccurrenceI } from "../../Slices/DataSlice";
import { setSelectedEventVerbStart } from "../../Slices/TabSlice";
import { openModal } from "../../Slices/ModalSlice";
import { RootStoreI } from "../../Store";
//targetEventKey
const generateContent = (
  eventListInput: EventI[],
  paragraph: string,
  selectedEventVerbStart: number | null,
  setVerbStart: (targetSelectedEventVerbStart: number | null) => {
    payload: number | null;
    type: string;
  },
  openModal: (targetEventKey: string) => {
    payload: {
      targetEventKey: string;
    };
    type: string;
  },

  ref: React.RefObject<HTMLElement>
) => {
  const eventList: EventI[] = JSON.parse(JSON.stringify(eventListInput));

  const textOccurrenceMap: Record<string | number, TextOccurrenceI> = {};
  eventList.forEach((eventItem) => {
    const {
      eventId,
      event,
      verbStartByteText,
      verbEndByteText,
      sentenceId,
      argument,
      argText,
      argStartByteText,
      argEndByteText,
    } = eventItem;
    if (!textOccurrenceMap[verbStartByteText]) {
      textOccurrenceMap[verbStartByteText] = {
        type: "verb",
        occurrenceText: event,
        textStartIndex: verbStartByteText,
        textEndIndex: verbEndByteText,
        textLength: event.length,
        associatedStartIndex: [],
        targetEventKey: `${sentenceId}+${eventId}`,
      };
    }
    textOccurrenceMap[argStartByteText] = {
      type: argument,
      occurrenceText: argText,
      textStartIndex: argStartByteText,
      textEndIndex: argEndByteText,
      textLength: argText.length,
      associatedStartIndex: [verbStartByteText],
      targetEventKey: undefined,
    };

    textOccurrenceMap[verbStartByteText].associatedStartIndex.push(
      argStartByteText
    );
    textOccurrenceMap[verbStartByteText].associatedStartIndex.sort(
      (a, b) => a - b
    );
  });

  const textTextOccurrenceList: TextOccurrenceI[] = [];
  Object.keys(textOccurrenceMap).forEach((key) => {
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
          ref={
            textOccurrence.textStartIndex === selectedEventVerbStart
              ? ref
              : null
          }
          key={`span-${textOccurrence.textStartIndex}`}
          className={`text--occurrence__primary${
            selectedEventVerbStart === textOccurrence.textStartIndex
              ? "__selected"
              : ""
          }`}
          tabIndex={0}
          onFocus={() => {
            setVerbStart(textOccurrence.textStartIndex);
          }}
          onBlur={() => setVerbStart(null)}
          onDoubleClick={(e) => {
            openModal(`${textOccurrence.targetEventKey}`);
          }}
          style={{ backgroundColor: "grey" }}
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
          key={`span-${textOccurrence.textStartIndex}`}
          className={`${
            selectedEventVerbStart !== null &&
            textOccurrence.associatedStartIndex.includes(selectedEventVerbStart)
              ? `text--occurrence__secondary`
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

const ReactiveParagraph = ({ eventList }: { eventList: EventI[] }) => {
  const { paragraph } = useSelector((store: RootStoreI) => store.dataReducer);
  const selectedHTMLElement = useRef<HTMLElement>(null);
  const { selectedEventVerbStart } = useSelector(
    (store: RootStoreI) => store.tabReducer
  );
  const dispatch = useDispatch();

  const memoizedContent = useMemo(() => {
    return generateContent(
      eventList,
      paragraph,
      selectedEventVerbStart,
      (targetSelectedEventVerbStart: number | null) =>
        dispatch(setSelectedEventVerbStart(targetSelectedEventVerbStart)),
      (targetEventKey: string) => dispatch(openModal({ targetEventKey })),

      selectedHTMLElement
    );
  }, [eventList, paragraph, selectedEventVerbStart, dispatch]);

  useEffect(
    () =>
      selectedHTMLElement.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      }),
    [memoizedContent]
  );

  return (
    <React.Fragment>
      <p className="report--reactive--paragraph">{memoizedContent}</p>
    </React.Fragment>
  );
};

export default ReactiveParagraph;
