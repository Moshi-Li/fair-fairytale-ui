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
  const [displayingResults, setDisplayingResults] = useState<Array<string>>([]);
  const appDispatchAction = useAppDispatch();

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
    const serverStatusChecker = setInterval(() => {
      appDispatchAction(checkServerStatus());
    }, 10 * 1000);

    return () => clearInterval(serverStatusChecker);
  }, [appDispatchAction]);

  return (
    <div className="story--input--container">
      <div className="example--container">
        <p>Examples:</p>
        <div className="search--bar--container">
          <input
            className="search--bar--input"
            onChange={(e) => setSearchString(e.target.value)}
          ></input>
          <p className="search--bar--result">
            {searchString === ""
              ? "displaying randomly selected 5 example results"
              : `displaying ${displayingResults.length} results for query "${searchString}"`}
          </p>
        </div>

        <div className="example--container--list">
          {displayingResults.map((name) => (
            <button
              onClick={() =>
                appDispatchAction(fetchData(name.split(" ").join("-")))
              }
            >
              {name}
            </button>
          ))}
        </div>
        <div className="example--container--status">
          <p>Server Status:</p>
          {serverStatus && <StatusIndicator Positive Pulse />}
          {!serverStatus && <StatusIndicator Negative Pulse />}
        </div>
      </div>

      <textarea
        className="story--input--textarea"
        value={storyInput}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setStoryInput(e.target.value)
        }
      ></textarea>
      {!fetching && (
        <button
          className="story--input--btn"
          title="Server is down"
          onClick={(e) => {
            appDispatchAction(runPipeline(storyInput));
          }}
          disabled={!serverStatus}
        >
          Test
        </button>
      )}
      {fetching && <AiOutlineLoading3Quarters className="loader" />}
    </div>
  );
};

export default StoryInput;
