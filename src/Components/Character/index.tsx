import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStoreI } from "../../Store";
import { EventI, CharacterStatI } from "../../Slices/DataSlice";
import Graph from "./Graph";
import Paragraph from "./ReactiveParagraph";
import Stat from "./Stat";
import "./index.scss";

const RandomColor = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

const Character = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [selectedEvents, setSelectedEvents] = useState<EventI[]>([]);
  const [selectedEventVerbStart, setSelectedEventVerbStart] = useState<
    number | null
  >(null);
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

    setCharacterList(result.slice(0, 5));
    setColorScheme({
      [result[0].corefId]: RandomColor(),
      [result[1].corefId]: RandomColor(),
      [result[2].corefId]: RandomColor(),
      [result[3].corefId]: RandomColor(),
      [result[4].corefId]: RandomColor(),
    });
  }, [setCharacterList, characterMeta]);

  useEffect(() => {
    let eventList = JSON.parse(
      JSON.stringify(
        selectedCharacterId === null
          ? Object.entries(characterMeta)
              .map(([key, { relatedEvents }]) => relatedEvents)
              .flat()
          : characterMeta[selectedCharacterId].relatedEvents
      )
    ) as EventI[];
    setSelectedEvents(eventList);
  }, [selectedCharacterId, characterMeta]);

  return (
    <div className="character--container">
      <div className="character--content">
        <div className="character--content--left">
          <p className="section--label">Character Select</p>
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
              selectedCharacterId ? colorScheme[selectedCharacterId] : "grey"
            }
            selectedEventVerbStart={selectedEventVerbStart}
            setSelectedEventVerbStart={setSelectedEventVerbStart}
          />
        </div>
        <Graph
          color={
            selectedCharacterId ? colorScheme[selectedCharacterId] : "grey"
          }
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
