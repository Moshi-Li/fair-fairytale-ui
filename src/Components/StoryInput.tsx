import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import StatusIndicator from "react-status-indicator";
import { RootStoreI, useAppDispatch } from "../Store";
import { fetchData, runPipeline, checkServerStatus } from "../Slices/DataSlice";

import "./StoryInput.scss";

const storyNames = [
  "a-fish-story",
  "a-french-puck",
  "a-legend-of-confucius",
  "a-legend-of-knockmany",
  "ali-baba-and-forty-thieves",
  "alleleiraugh-or-the-many-furred-creature",
  "bamboo-cutter-moon-child",
  "black-arts",
  "black-sheep",
  "bokwewa-the-humpback",
  "buckwheat",

  "old-hop-giant",
  "yuletide-specters",
  "the-fire-god",
  "the-story-of-miss-moppet",
  "skipper-and-sir-urian",
  "troll-wedding",
  "girl-and-snake",
  "the-winter-spirit-and-his-visitor",
  "the-death-of-the-hen",
  "tale-of-tom-kitten",
  "the-favorite-of-fortune-and-the-child-of-ill-luck",
  "grandmother",
  "the-flying-ogre",
  "stompe-pilt",
  "the-straw-the-coal-and-the-bean",
  "finn-the-giant-and-the-minister-of-lund",
  "the-abbot-of-inisfalen",
  "starkad-bale",
  "the-king-of-the-ants",
  "the-miserly-farmer",
  "mr-korbes",
  "self-did-it",
  "spectre-fjelkinge",
  "a-fish-story",
  "laotsze",
  "the-teapot",
  "buckwheat",
  "old-sultan",
  "skalunda-giant",
  "the-mouse-the-bird-and-the-sausage",
];

const randomSelectFromArray = (arr: Array<any>, count: number) => {
  if (count > arr.length) return [];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return result;
};

const StoryInput = () => {
  const { fetching, serverStatus } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const [searchString, setSearchString] = useState("");
  const [storyInput, setStoryInput] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [displayingResults, setDisplayingResults] = useState<Array<string>>([]);
  const appDispatchAction = useAppDispatch();

  useEffect(() => {
    if (serverStatus === 0 || serverStatus === 1) return;

    const pointer = setInterval(
      () =>
        setRemainingTime(
          parseInt((new Date().getTime() / 1000 - serverStatus).toString())
        ),
      100
    );
    return () => clearInterval(pointer);
  }, [setRemainingTime, serverStatus]);
  useEffect(() => {
    const nextDisplayingResults =
      searchString === ""
        ? randomSelectFromArray(storyNames, 5).map((name) =>
            name.split("-").join(" ")
          )
        : storyNames
            .filter((name) => {
              return name
                .split("-")
                .join(" ")
                .includes(searchString.toLocaleLowerCase());
            })
            .map((name) => name.split("-").join(" "));

    setDisplayingResults(nextDisplayingResults);
  }, [searchString]);

  useEffect(() => {
    appDispatchAction(checkServerStatus());
    const serverStatusChecker = setInterval(() => {
      appDispatchAction(checkServerStatus());
    }, 10 * 1000);

    return () => clearInterval(serverStatusChecker);
  }, [appDispatchAction]);

  return (
    <div className="story--input--container">
      <div className="example--container">
        <h2>Story examples</h2>
        <p>
          Type in the name of a story or click on one below to see NECE results
        </p>
        <div className="search--bar--container">
          <div className="form-field">
            <input
              className="search--bar--input"
              onChange={(e) => setSearchString(e.target.value)}
            ></input>
            <span className="icon">🔍</span>
          </div>
          <p className="search--bar--result">
            {searchString === ""
              ? "displaying randomly selected 5 example results"
              : `displaying ${displayingResults.length} results for query "${searchString}"`}
          </p>
        </div>

        <div className="example--container--list">
          {displayingResults.map((name, index) => (
            <button
              key={index}
              onClick={() =>
                appDispatchAction(fetchData(name.split(" ").join("-")))
              }
            >
              {name}
            </button>
          ))}
        </div>
        <div className="example--container--status">
          <h2>Server status:</h2>
          {serverStatus === 1 && <StatusIndicator Positive Pulse />}
          {serverStatus > 1 && (
            <React.Fragment>
              <StatusIndicator Intermediary Pulse />
              <span className="status--pending--msg">{`Last task had started for ${remainingTime}s`}</span>
            </React.Fragment>
          )}
          {!serverStatus && <StatusIndicator Negative Pulse />}
        </div>
        <p>You can also paste a story to display NECE results</p>
      </div>

      <textarea
        className="story--input--textarea"
        value={storyInput}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setStoryInput(e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
          setStoryInput(
            e.target.value
              .replaceAll("\n\n", " ")
              .replaceAll("\n", " ")
              .replaceAll("\r\r", " ")
              .replaceAll("\n", " ")
              .trim()
              .replace(/ +(?= )/g, "")
              .replace(`"`, `'`)
              .replace(`"`, `'`)
          );
        }}
      ></textarea>

      {!fetching && (
        <button
          className="story--input--btn"
          title="Server is down"
          onClick={(e) => {
            appDispatchAction(runPipeline(storyInput));
          }}
          disabled={serverStatus !== 1}
        >
          Test
        </button>
      )}
      {fetching && <AiOutlineLoading3Quarters className="loader" />}
    </div>
  );
};

export default StoryInput;
