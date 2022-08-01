import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import { EventI } from "../../Slices/DataSlice";
import Graph from "./Graph";
import Paragraph from "./ReactiveParagraph";

import "./index.scss";

const Character = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);

  const { eventMajorList, characterMeta, paragraph } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    let result: any = {};
    let eventList = JSON.parse(
      JSON.stringify(
        selectedCharacterId === null
          ? eventMajorList
          : characterMeta[selectedCharacterId].relatedEvents
      )
    ) as EventI[];

    eventList.forEach((event) => {
      result[event.verbStartByteText] = event;
    });

    if (selectedCharacterId === null) {
      eventList = Object.keys(result).map((key) => {
        return {
          ...result[key],
          gender: "mix",
        };
      });
    } else {
      eventList = Object.keys(result).map((key) => {
        return {
          ...result[key],
        };
      });
    }

    setSelectedEvents(eventList);
  }, [selectedCharacterId, eventMajorList]);

  return (
    <div className="character-container">
      <div className="character-content">
        <div className="character-list">
          {Object.keys(characterMeta)
            .map((key) => {
              return characterMeta[key].relatedEvents?.length ? (
                <React.Fragment>
                  <button
                    key={key}
                    style={{
                      borderColor: selectedCharacterId === key ? "green" : "",
                    }}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      setSelectedCharacterId(key);
                    }}
                  >
                    {characterMeta[key].easyName}
                  </button>
                </React.Fragment>
              ) : null;
            })
            .flat()}
        </div>
        <Paragraph eventList={selectedEvents} />
        <Graph eventList={selectedEvents}></Graph>
      </div>
    </div>
  );
};

export default Character;
