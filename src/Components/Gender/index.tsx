import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";

import { EventI } from "../../Slices/DataSlice";

import { VerticalDivider } from "../Utility";
import Paragraph from "./ReactiveParagraph";
import ReactiveGraph from "./Graph";
import Stat from "./Stat";
import genderImage from "./genderStat.png";
import "./index.scss";

const Gender = () => {
  const [gender, setGender] = useState<"male" | "female" | "mix">("male");
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const [selectedEventVerbStart, setSelectedEventVerbStart] = useState<
    number | null
  >(null);
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
        return result[key][gender];
      })
      .flat();

    setSelectedEvents(eventList);
  }, [gender, eventMajorList]);

  return (
    <div className="gender-container">
      <div className="gender-content">
        <p className="section--label">Story</p>
        <Paragraph
          gender={gender}
          eventList={selectedEvents}
          selectedEventVerbStart={selectedEventVerbStart}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        />

        <p className="section--label">Gender Select</p>
        <div className="filter--container">
          <button
            className={`filter--btn ${
              gender === "male" ? "filter-btn__selected " : ""
            }`}
            onClick={(e) => {
              setGender("male");
              setSelectedEventVerbStart(null);
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
              setSelectedEventVerbStart(null);
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
              setSelectedEventVerbStart(null);
            }}
          >
            Mix
          </button>
        </div>

        <ReactiveGraph eventList={selectedEvents}></ReactiveGraph>
      </div>
      <VerticalDivider />
      <div className="gender--stat">
        <Stat></Stat>
      </div>
    </div>
  );
};

export default Gender;
