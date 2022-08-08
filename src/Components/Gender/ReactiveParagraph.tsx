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
  return [];
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
