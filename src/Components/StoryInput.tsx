import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import StatusIndicator from "react-status-indicator";
import { RootStoreI, useAppDispatch } from "../Store";
import { fetchData } from "../Slices/DataSlice";

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
];

const StoryInput = () => {
  const { fetching } = useSelector((store: RootStoreI) => store.dataReducer);
  const [searchString, setSearchString] = useState("");
  const appDispatchAction = useAppDispatch();

  const displayingResults = storyNames
    .filter((name) => {
      return name.split("-").join(" ").includes(searchString);
    })
    .map((name) => name.split("-").join(" "));
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
              ? "displaying first 5 results"
              : `displaying ${displayingResults.length} results for query "${searchString}"`}
          </p>
        </div>

        <div className="example--container--list">
          {displayingResults
            .slice(0, searchString === "" ? 5 : displayingResults.length)
            .map((name) => (
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
          <StatusIndicator Negative Pulse />
        </div>
      </div>

      <textarea className="story--input--textarea"></textarea>
      {!fetching && (
        <button className="story--input--btn" disabled title="Server is down">
          Test
        </button>
      )}
      {fetching && <AiOutlineLoading3Quarters className="loader" />}
    </div>
  );
};

export default StoryInput;
