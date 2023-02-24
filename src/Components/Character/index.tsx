import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootStoreI } from "../../Store";
import { EventI, CharacterStatI } from "../../Slices/DataSlice";

import Paragraph from "./ReactiveParagraph";
import Graph from "./Graph";
import Stat from "./Stat";
import { ScrollDownBtn } from "../Utility";

import "./index.scss";
import RatioGraph from "./RatioGraph";

const RandomColor = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

const Character = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const [characterList, setCharacterList] = useState<null | CharacterStatI[]>(
    null
  );

  const [colorScheme, setColorScheme] = useState<Record<string, string>>({});

  const { characterMeta } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  useEffect(() => {
    const result: CharacterStatI[] = Object.keys(characterMeta).map((key) => {
      const { easyName, gender, importance, total, corefId } =
        characterMeta[key];

      return {
        name: easyName,
        gender,
        importance,
        appearance: total,
        corefId,
      };
    });
    result.sort((a, b) => b.appearance - a.appearance);

    const nextResult = result.slice(0, result.length >= 5 ? 5 : result.length);
    setCharacterList(nextResult);
    const nextColorScheme: Record<string, string> = {};
    nextResult.forEach((item) => {
      nextColorScheme[item.corefId] = RandomColor();
    });
    setColorScheme(nextColorScheme);
  }, [setCharacterList, characterMeta]);

  useEffect(() => {
    let eventList = [];
    if (selectedCharacterId === null) {
      const visitedMap: Record<number | string, any> = {};
      eventList = Object.entries(characterMeta)
        .map(([key, { relatedEvents }]) => relatedEvents)
        .flat()
        .filter((item) => {
          if (item && visitedMap[item?.verbStartByteText] === undefined) {
            visitedMap[item?.verbStartByteText] = true;
            return true;
          }
          return false;
        }) as EventI[];
    } else {
      eventList = characterMeta[selectedCharacterId].relatedEvents as EventI[];
    }
    setSelectedEvents(eventList);
  }, [selectedCharacterId, characterMeta]);

  return (
    <div className="character--container">
      <div className="character--content">
        <div className="character--content--left">
          <p className="section--label">Select character</p>
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
                All
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
                  style={{
                    borderColor: colorScheme[item.corefId],
                  }}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
          <p className="section--label">Story</p>
          <Paragraph
            eventList={selectedEvents}
            color={
              selectedCharacterId ? colorScheme[selectedCharacterId] : "#a7a7a7"
            }
          />
        </div>
        <Graph
          color={
            selectedCharacterId ? colorScheme[selectedCharacterId] : "silver"
          }
          eventList={selectedEvents}
        ></Graph>
      </div>

      <div className="character--stat">
        <Stat setSelectedCharacterId={setSelectedCharacterId}></Stat>
      </div>
      <RatioGraph></RatioGraph>
      <ScrollDownBtn></ScrollDownBtn>
    </div>
  );
};

export default Character;
