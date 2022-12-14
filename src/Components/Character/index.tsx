import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import { EventI, CharacterMetaI } from "../../Slices/DataSlice";
import Graph from "./Graph";
import Paragraph from "./ReactiveParagraph";
import Stat from "./Stat";
import "./index.scss";

const Character = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const [selectedEventVerbStart, setSelectedEventVerbStart] = useState<
    number | null
  >(null);
  const [characterList, setCharacterList] = useState<null | CharacterMetaI[]>(
    null
  );

  const { eventMajorList, characterMeta } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    const result = Object.keys(characterMeta).map((key) => characterMeta[key]);
    result.sort((a, b) => {
      if (!a.relatedEvents) {
        return -1;
      } else if (!b.relatedEvents) {
        return -1;
      } else {
        return b.relatedEvents?.length - a.relatedEvents?.length;
      }
    });

    setCharacterList(result.slice(0, 5));
  }, [setCharacterList, characterMeta]);

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
  }, [selectedCharacterId, eventMajorList, characterMeta]);

  return (
    <div className="character--container">
      <div className="character--content">
        <div className="character--content--left">
          <p className="section--label">Gender Select</p>
          <div className="character--list">
            {characterList && characterList.length && (
              <button
                className={`filter--btn ${
                  selectedCharacterId === null ? "filter-btn__selected" : ""
                }`}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setSelectedCharacterId(null);
                }}
              >
                Alł
              </button>
            )}
            {characterList?.map((item) => {
              return (
                <button
                  key={item.corefId}
                  className={`filter--btn ${
                    selectedCharacterId === item.corefId
                      ? "filter-btn__selected"
                      : ""
                  }`}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    setSelectedCharacterId(item.corefId);
                  }}
                >
                  {item.easyName}
                </button>
              );
            })}
          </div>
          <p className="section--label">Story</p>
          <Paragraph
            eventList={selectedEvents}
            gender={
              selectedCharacterId === null
                ? "mix"
                : characterMeta[selectedCharacterId].gender === "male" ||
                  characterMeta[selectedCharacterId].gender === "female"
                ? characterMeta[selectedCharacterId].gender
                : "mix"
            }
            selectedEventVerbStart={selectedEventVerbStart}
            setSelectedEventVerbStart={setSelectedEventVerbStart}
          />
        </div>

        <Graph
          eventList={selectedEvents}
          setSelectedEventVerbStart={setSelectedEventVerbStart}
        ></Graph>
      </div>

      <div className="character--stat">
        <Stat setSelectedCharacterId={setSelectedCharacterId}></Stat>
      </div>
    </div>
  );
};

export default Character;
