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

  console.log(duplicatedEvent);
  useEffect(() => {
    const visitedMap: Record<number | string, any> = {};
    const result: number[] = [];

    eventMajorList.forEach((item) => {
      if (visitedMap[item.verbStartByteText] === true) {
        result.push(item.verbStartByteText);
      } else {
        visitedMap[item.verbStartByteText] = true;
      }
    });

    setDuplicatedEvent(result);
  }, [eventMajorList, setDuplicatedEvent]);

  return (
    <div className="salient-container">
      <div className="salient-content">
        <Paragraph
          eventList={eventMajorList}
          selectedEventVerbStart={selectedEventVerbStart}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        />
        <ReactiveGraph
          eventList={eventMajorList}
          duplicatedEvent={duplicatedEvent}
        ></ReactiveGraph>
      </div>
    </div>
  );
};

export default Salient;
