import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import { EventI } from "../../Slices/DataSlice";
import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";

import "./index.scss";

const Salient = () => {
  const [gender, setGender] = useState<"male" | "female" | "mix">("male");
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  useEffect(() => {
    let result: any = {};
    let eventList = JSON.parse(JSON.stringify(eventMajorList));
    eventList.forEach((item: EventI) => {
      if (!result[item.verbStartByteText]) {
        result[item.verbStartByteText] = { male: [], female: [], mix: [] };
      }

      if (item.gender === "male" || item.gender === "female") {
        result[item.verbStartByteText][item.gender].push(item);
      } else {
        result[item.verbStartByteText]["mix"].push(item);
      }
    });

    eventList = Object.keys(result)
      .filter((key) => {
        return result[key][gender].length >= 1;
      })
      .map((key) => {
        return result[key][gender][0];
      });

    setSelectedEvents(eventList);
  }, [gender, eventMajorList]);

  return (
    <div className="salient-container">
      <button
        onClick={(e) => {
          setGender("male");
        }}
      >
        Male
      </button>
      <button
        onClick={(e) => {
          setGender("female");
        }}
      >
        Female
      </button>
      <button
        onClick={(e) => {
          setGender("mix");
        }}
      >
        Mix
      </button>
      <div className="salient-content">
        <Paragraph gender={gender} eventList={selectedEvents} />
        <ReactiveGraph eventList={selectedEvents}></ReactiveGraph>
      </div>
    </div>
  );
};

export default Salient;
