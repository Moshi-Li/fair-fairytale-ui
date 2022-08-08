import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import { EventI } from "../../Slices/DataSlice";
import Graph from "./Graph";
import Paragraph from "./ReactiveParagraph";

const Gender = () => {
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);

  const { eventMajorList, paragraph } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    let result: {
      male: EventI[];
      female: EventI[];
      mix: EventI[];
    } = { male: [], female: [], mix: [] };
    let eventList = JSON.parse(JSON.stringify(eventMajorList)) as EventI[];

    eventList.forEach((event) => {
      if (event.gender === "male") {
        result.male.push(event);
      } else if (event.gender === "female") {
        result.female.push(event);
      } else {
        result.mix.push(event);
      }
    });

    let eventsMap: Record<number, boolean> = {};
    result.male = result.male
      .map((event: EventI) => {
        if (event && eventsMap[event.temporalRank]) {
          return undefined;
        } else if (event) {
          eventsMap[event.temporalRank] = true;
          return event;
        } else {
          return undefined;
        }
      })
      .filter((event) => {
        return event !== undefined;
      }) as EventI[];

    eventsMap = {};
    result.female = result.female
      .map((event: EventI) => {
        if (event && eventsMap[event.temporalRank]) {
          return undefined;
        } else if (event) {
          eventsMap[event.temporalRank] = true;
          return event;
        } else {
          return undefined;
        }
      })
      .filter((event) => {
        return event !== undefined;
      }) as EventI[];

    eventsMap = {};
    result.mix = result.mix
      .map((event: EventI) => {
        if (event && eventsMap[event.temporalRank]) {
          return undefined;
        } else if (event) {
          eventsMap[event.temporalRank] = true;
          return event;
        } else {
          return undefined;
        }
      })
      .filter((event) => {
        return event !== undefined;
      }) as EventI[];

    result.female.sort((a, b) => {
      return a.temporalRank - b.temporalRank;
    });
    result.male.sort((a, b) => {
      return a.temporalRank - b.temporalRank;
    });
    result.mix.sort((a, b) => {
      return a.temporalRank - b.temporalRank;
    });

    setSelectedEvents(result.female.concat(result.male).concat(result.mix));
  }, [eventMajorList]);

  return (
    <div className="salient-container">
      <div className="salient-content">
        <Graph eventList={selectedEvents}></Graph>
      </div>
    </div>
  );
};

export default Gender;
