import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import { EventI } from "../../Slices/DataSlice";
import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";

import "./index.scss";

const Salient = () => {
  const [selectedEventVerbStart, setSelectedEventVerbStart] = useState<
    number | null
  >(null);
  const [duplicatedEvent, setDuplicatedEvent] = useState<number[]>([]);
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    const visitedMap: Record<number | string, any> = {};
    const result = [];

    eventMajorList.forEach((item) => {
      if (visitedMap[item.verbStartByteText]) {
        result.push(item.verbStartByteText);
      } else {
        visitedMap[item.verbStartByteText] = true;
      }
    });
  }, [eventMajorList, setDuplicatedEvent]);
  return (
    <div className="salient-container">
      <div className="salient-content">
        <Paragraph
          eventList={eventMajorList}
          selectedEventVerbStart={selectedEventVerbStart}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        />
        <ReactiveGraph eventList={eventMajorList}></ReactiveGraph>
      </div>
    </div>
  );
};

export default Salient;
