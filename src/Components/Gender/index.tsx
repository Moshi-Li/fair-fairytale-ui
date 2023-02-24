import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootStoreI } from "../../Store";
import { EventI } from "../../Slices/DataSlice";
import { setSelectedEventVerbStart } from "../../Slices/TabSlice";

import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";
import Stat from "./Stat";
import RatioGraph from "./RatioGraph";
import { ScrollDownBtn } from "../Utility";

import "./index.scss";

const Gender = () => {
  const [gender, setGender] = useState<"male" | "female" | "mix">("male");
  const { eventMajorList } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const dispatch = useDispatch();

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
        return result[key][gender];
      })
      .flat();

    setSelectedEvents(eventList);
  }, [gender, eventMajorList]);

  return (
    <div className="gender--container">
      <div className="gender--content">
        <div className="gender--content--left">
          <p className="section--label">Select gender</p>
          <div className="filter--container">
            <button
              className={`filter--btn ${
                gender === "male" ? "filter-btn__selected " : ""
              }`}
              onClick={(e) => {
                setGender("male");
                dispatch(setSelectedEventVerbStart(null));
              }}
            >
              Male
            </button>
            <button
              className={`filter--btn ${
                gender === "female" ? "filter-btn__selected " : ""
              }`}
              onClick={(e) => {
                setGender("female");
                dispatch(setSelectedEventVerbStart(null));
              }}
            >
              Female
            </button>
            <button
              className={`filter--btn ${
                gender === "mix" ? "filter-btn__selected " : ""
              }`}
              onClick={(e) => {
                setGender("mix");
                dispatch(setSelectedEventVerbStart(null));
              }}
            >
              Mix
            </button>
          </div>
          <p className="section--label">Story</p>
          <Paragraph gender={gender} eventList={selectedEvents} />
        </div>
        <ReactiveGraph eventList={selectedEvents}></ReactiveGraph>
      </div>

      <div className="gender--stat">
        <Stat></Stat>
        <RatioGraph></RatioGraph>
      </div>

      <ScrollDownBtn></ScrollDownBtn>
    </div>
  );
};

export default Gender;
